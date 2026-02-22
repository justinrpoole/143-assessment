import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const ENV_FILE_PATTERN = /^\.env(\..+)?$/;

const CLIENT_ROOTS = [
  path.resolve(process.cwd(), "src/components"),
  path.resolve(process.cwd(), "src/app"),
];
const API_ROOT = path.resolve(process.cwd(), "src/app/api");
const SCAN_ROOTS_FOR_HEADERS = [
  path.resolve(process.cwd(), "src"),
  path.resolve(process.cwd(), "scripts"),
];
const IGNORED_DIRS = new Set(["node_modules", ".next", ".git", "dist", "coverage"]);

function isCodeFile(filePath) {
  return CODE_EXTENSIONS.has(path.extname(filePath));
}

async function walk(dirPath) {
  const files = [];
  let entries = [];
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) {
        continue;
      }
      files.push(...(await walk(fullPath)));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

function getLineNumber(content, index) {
  return content.slice(0, index).split("\n").length;
}

function isInsideApiRoute(filePath) {
  const relative = path.relative(API_ROOT, filePath);
  return !relative.startsWith("..") && !path.isAbsolute(relative);
}

function looksLikePlaceholder(value) {
  return /__PASTE|YOUR_|CHANGEME|PLACEHOLDER/i.test(value);
}

async function collectClientCodeFiles() {
  const files = [];
  for (const root of CLIENT_ROOTS) {
    const discovered = await walk(root);
    for (const filePath of discovered) {
      if (!isCodeFile(filePath)) continue;
      if (isInsideApiRoute(filePath)) continue;
      files.push(filePath);
    }
  }
  return files;
}

async function checkClientSecretLeakage() {
  const findings = [];
  const clientFiles = await collectClientCodeFiles();

  for (const filePath of clientFiles) {
    const content = await fs.readFile(filePath, "utf8");

    const sbSecretPattern = /sb_secret_[A-Za-z0-9_-]+/g;
    let match;
    while ((match = sbSecretPattern.exec(content)) !== null) {
      findings.push({
        type: "sb_secret_in_client",
        filePath,
        line: getLineNumber(content, match.index),
        detail: match[0],
      });
    }

    const forbiddenClientEnvPattern =
      /\b(?:NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SERVICE_ROLE_KEY)\b/g;
    while ((match = forbiddenClientEnvPattern.exec(content)) !== null) {
      findings.push({
        type: "service_role_reference_in_client",
        filePath,
        line: getLineNumber(content, match.index),
        detail: match[0],
      });
    }
  }

  const rootFiles = await fs.readdir(process.cwd());
  const envFiles = rootFiles.filter((name) => ENV_FILE_PATTERN.test(name));
  for (const fileName of envFiles) {
    const filePath = path.resolve(process.cwd(), fileName);
    const content = await fs.readFile(filePath, "utf8");
    for (const [lineIndex, line] of content.split("\n").entries()) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      if (!trimmed.startsWith("NEXT_PUBLIC_")) continue;
      if (trimmed.includes("sb_secret_")) {
        findings.push({
          type: "sb_secret_in_next_public_env",
          filePath,
          line: lineIndex + 1,
          detail: "NEXT_PUBLIC_* contains sb_secret_ value",
        });
      }
      if (
        trimmed.startsWith("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=") &&
        !looksLikePlaceholder(trimmed)
      ) {
        findings.push({
          type: "service_role_in_next_public_env",
          filePath,
          line: lineIndex + 1,
          detail: "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY is forbidden",
        });
      }
    }
  }

  return findings;
}

function hasJwtGuard(content, variableName) {
  const escaped = variableName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`${escaped}\\.startsWith\\(["']eyJ["']\\)`),
    new RegExp(`startsWith\\(["']eyJ["']\\)`),
  ];
  return patterns.some((pattern) => pattern.test(content));
}

async function checkAuthorizationBearerUsage() {
  const findings = [];
  const files = [];
  for (const root of SCAN_ROOTS_FOR_HEADERS) {
    files.push(...(await walk(root)));
  }

  const bearerPattern =
    /Authorization\s*:\s*`Bearer\s*\$\{([^}]+)\}`/g;

  for (const filePath of files) {
    if (!isCodeFile(filePath)) continue;
    const content = await fs.readFile(filePath, "utf8");
    let match;
    while ((match = bearerPattern.exec(content)) !== null) {
      const expression = match[1].trim();
      const line = getLineNumber(content, match.index);
      const looksSupabaseContext =
        /SUPABASE_SERVICE_ROLE_KEY|sb_secret_|supabase/i.test(content) ||
        /serviceRoleKey|supabaseKey/.test(expression);

      if (/sb_secret_|sb_publishable_|SUPABASE_SERVICE_ROLE_KEY/.test(expression)) {
        findings.push({
          type: "sb_key_in_bearer_header",
          filePath,
          line,
          detail: expression,
        });
        continue;
      }

      if (looksSupabaseContext) {
        const candidateIdentifier = expression.match(/^[A-Za-z_$][A-Za-z0-9_$]*$/)?.[0];
        const guarded = candidateIdentifier
          ? hasJwtGuard(content, candidateIdentifier)
          : hasJwtGuard(content, "key");
        if (!guarded) {
          findings.push({
            type: "supabase_bearer_missing_jwt_guard",
            filePath,
            line,
            detail: expression,
          });
        }
      }
    }
  }

  return findings;
}

async function checkGitignoreEnvProtection() {
  const gitignorePath = path.resolve(process.cwd(), ".gitignore");
  try {
    const content = await fs.readFile(gitignorePath, "utf8");
    const hasEnvStar = content.includes(".env*");
    const hasEnvLocal = content.includes(".env.local");
    if (!hasEnvStar && !hasEnvLocal) {
      return [
        {
          type: "missing_env_gitignore",
          filePath: gitignorePath,
          line: 1,
          detail: "Expected .env* or .env.local ignore rule.",
        },
      ];
    }
    return [];
  } catch {
    return [
      {
        type: "missing_gitignore",
        filePath: gitignorePath,
        line: 1,
        detail: ".gitignore not found",
      },
    ];
  }
}

function printFindings(title, findings) {
  console.log(`${title}: ${findings.length}`);
  for (const finding of findings) {
    console.log(
      `- ${finding.type} @ ${finding.filePath}:${finding.line} (${finding.detail})`,
    );
  }
}

async function main() {
  const clientFindings = await checkClientSecretLeakage();
  const headerFindings = await checkAuthorizationBearerUsage();
  const gitignoreFindings = await checkGitignoreEnvProtection();
  const allFindings = [...clientFindings, ...headerFindings, ...gitignoreFindings];

  console.log("qa:security summary");
  console.log(`client_paths_checked: ${CLIENT_ROOTS.length}`);
  printFindings("client_secret_findings", clientFindings);
  printFindings("authorization_header_findings", headerFindings);
  printFindings("gitignore_findings", gitignoreFindings);

  if (allFindings.length > 0) {
    console.error("qa:security FAILED");
    process.exit(1);
  }

  console.log("qa:security PASS");
}

main().catch((error) => {
  console.error("qa:security FAILED");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
