import fs from 'node:fs';
import path from 'node:path';

const appRoot = process.cwd();
const workspaceRoot = path.resolve(appRoot, '..');
const specSourceRootCandidates = [
  process.env.SPEC_SOURCE_ROOT
    ? path.resolve(appRoot, process.env.SPEC_SOURCE_ROOT)
    : null,
  path.join(appRoot, 'specs', '143leadership_build_spec_v1_2'),
  path.join(workspaceRoot, 'specs', '143leadership_build_spec_v1_2'),
].filter(Boolean);
const specSourceRoot = specSourceRootCandidates.find((candidate) =>
  fs.existsSync(candidate),
) ?? null;
const outputDir = path.join(appRoot, 'src', 'data', 'integrated_specs');
const outputFile = path.join(outputDir, 'spec_bundle.json');

// V1 source-of-truth set
const markdownFiles = [
  { id: 'ia', name: '01_Page_Spec_Matrix.md', required: true },
  { id: 'module_library', name: '02_Module_Spec_Library.md', required: true },
  { id: 'entitlements', name: '03_Entitlements_State_Machine.md', required: true },
  { id: 'retention_engine', name: '06_Email_Automations_Blueprint.md', required: true },
  { id: 'qa_drift', name: '08_Event_Taxonomy_and_Analytics.md', required: true },
  { id: 'design_tokens', name: '10_Design_System_Tokens.md', required: true },
  { id: 'journey', name: '00_Build_Backlog.md', required: false },

  // Compatibility aliases for existing runtime readers
  { id: 'copy_master', name: '10_Design_System_Tokens.md', required: true },
  { id: 'executive_portal', name: '03_Entitlements_State_Machine.md', required: true },
  { id: 'tone_lock_prompt', name: '02_Module_Spec_Library.md', required: true },
];

function wordCount(text) {
  return text
    .replace(/[\u2013\u2014]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function parseMarkdown(text) {
  const lines = text.split(/\r?\n/);
  const metadata = {
    version: '',
    word_count: '',
    last_updated: '',
  };

  for (const line of lines.slice(0, 20)) {
    if (line.startsWith('VERSION:')) metadata.version = line.replace('VERSION:', '').trim();
    if (line.startsWith('WORD COUNT:')) metadata.word_count = line.replace('WORD COUNT:', '').trim();
    if (line.startsWith('LAST UPDATED:')) metadata.last_updated = line.replace('LAST UPDATED:', '').trim();
  }

  const sections = [];
  for (const line of lines) {
    const headingMatch = /^(#{1,4})\s+(.+)$/.exec(line);
    if (headingMatch) {
      sections.push({
        level: headingMatch[1].length,
        title: headingMatch[2].trim(),
      });
    }
  }

  return {
    metadata,
    sections,
    computed_word_count: wordCount(text),
    content: text,
  };
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function resolveSpecFilePath(fileName) {
  if (!specSourceRoot) {
    return null;
  }
  return path.join(specSourceRoot, fileName);
}

function loadMarkdownFile(entry) {
  const filePath = resolveSpecFilePath(entry.name);
  if (!filePath) {
    return null;
  }

  if (!fs.existsSync(filePath)) {
    if (entry.required) {
      throw new Error(`Missing required V1 source file: ${filePath}`);
    }
    return null;
  }

  return fs.readFileSync(filePath, 'utf8');
}

function main() {
  ensureDir(outputDir);

  if (!specSourceRoot) {
    if (fs.existsSync(outputFile)) {
      console.warn(
        `Spec source directory not found. Keeping existing bundle at ${outputFile}.`,
      );
      return;
    }
    throw new Error(
      'No spec source directory found and no existing integrated spec bundle is present.',
    );
  }

  const mdDocs = {};
  for (const file of markdownFiles) {
    const text = loadMarkdownFile(file);
    if (!text) continue;

    mdDocs[file.id] = {
      id: file.id,
      file_name: file.name,
      ...parseMarkdown(text),
    };
  }

  const payload = {
    generated_at: new Date().toISOString(),
    source_root: specSourceRoot,
    markdown: mdDocs,
    csv: {},
  };

  fs.writeFileSync(outputFile, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${outputFile}`);
}

main();
