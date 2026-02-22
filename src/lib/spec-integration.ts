import specBundle from '@/data/integrated_specs/spec_bundle.json';

type MarkdownDoc = {
  id: string;
  file_name: string;
  metadata: { version?: string; word_count?: string; last_updated?: string };
  sections: Array<{ level: number; title: string }>;
  computed_word_count: number;
  content: string;
};

type CsvDoc = {
  id: string;
  file_name: string;
  metadata: { version?: string; word_count?: string; last_updated?: string };
  headers: string[];
  records: Record<string, string>[];
};

type BundleShape = {
  generated_at: string;
  source_root: string;
  markdown: Record<string, MarkdownDoc>;
  csv: Record<string, CsvDoc>;
};

const bundle = specBundle as BundleShape;

export const integratedSpecBundle = bundle;
export const integratedSpecGeneratedAt = bundle.generated_at;

export const sequenceLock = 'State -> System -> Rays -> Ripple';

function getDoc(id: keyof BundleShape['markdown'] | string): MarkdownDoc {
  const doc = bundle.markdown[id];
  if (!doc) {
    return {
      id: String(id),
      file_name: '',
      metadata: {},
      sections: [],
      computed_word_count: 0,
      content: '',
    };
  }
  return doc;
}

function getCsv(id: keyof BundleShape['csv'] | string): CsvDoc {
  const csv = bundle.csv[id];
  if (!csv) {
    return { id: String(id), file_name: '', metadata: {}, headers: [], records: [] };
  }
  return csv;
}

function between(content: string, start: string, end: string): string {
  const s = content.indexOf(start);
  if (s < 0) return '';
  const from = content.slice(s + start.length);
  const e = from.indexOf(end);
  if (e < 0) return from;
  return from.slice(0, e);
}

function extractHeadingBullets(content: string, heading: string): string[] {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === heading.trim());
  if (start < 0) return [];
  const out: string[] = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line.startsWith('## ')) break;
    if (line.startsWith('- ')) out.push(line.replace(/^- /, '').trim());
  }
  return out;
}

function extractH3TitlesInSection(content: string, sectionHeading: string): string[] {
  const scope = between(content, sectionHeading, '\n## ');
  if (!scope) return [];
  const titles: string[] = [];
  const regex = /^###\s+(.+)$/gm;
  let match = regex.exec(scope);
  while (match) {
    titles.push(match[1].trim());
    match = regex.exec(scope);
  }
  return titles;
}

function extractCurrency(content: string): { coreMonthly: string; assessment: string; premium: string } {
  const core = content.match(/\$14\.33[^\n]*/)?.[0] ?? '$14.33 monthly';
  const assessment = content.match(/\$43[^\n]*/)?.[0] ?? '$43 one-time';
  const premium = content.match(/\$143[^\n]*/)?.[0] ?? '$143 premium';
  return { coreMonthly: core.trim(), assessment: assessment.trim(), premium: premium.trim() };
}

function parseNotificationCap(content: string): number {
  const match = content.match(/max\s+(\w+|\d+)\s+notifications\/day/i);
  if (!match) return 3;
  const token = match[1].toLowerCase();
  if (/^\d+$/.test(token)) return Number(token);
  const map: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
  };
  return map[token] ?? 3;
}

function parseForbiddenTerms(content: string): string[] {
  const ruleBlock = between(content, '### 3.2 Forbidden changes (auto-fail)', '\n## 4)');
  if (!ruleBlock) return ['weakness', 'broken', 'toxic', 'personality type'];
  const lines = ruleBlock
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '));
  const merged = lines.join(' ').toLowerCase();
  const seed = ['weakness', 'broken', 'toxic', 'personality', 'diagnostic', 'shame'];
  const found = seed.filter((word) => merged.includes(word));
  return Array.from(new Set(found.length > 0 ? found : seed));
}

const iaDoc = getDoc('ia');
const journeyDoc = getDoc('journey');
const copyDoc = getDoc('copy_master');
const executiveDoc = getDoc('executive_portal');
const retentionDoc = getDoc('retention_engine');
const qaDoc = getDoc('qa_drift');
const promptDoc = getDoc('tone_lock_prompt');

const dataArchitectureCsv = getCsv('data_architecture');
const roadmapCsv = getCsv('feature_roadmap');

export const integratedDocs = {
  ia: iaDoc,
  journey: journeyDoc,
  copy: copyDoc,
  executive: executiveDoc,
  retention: retentionDoc,
  qa: qaDoc,
  tonePrompt: promptDoc,
};

export const integratedRoadmap = roadmapCsv.records;
export const integratedDataArchitecture = dataArchitectureCsv.records;

export const integratedPolicies = {
  sequence: sequenceLock,
  entryVectors: extractH3TitlesInSection(journeyDoc.content, '## 2. ENTRY VECTORS'),
  iaPublicRoutes: extractHeadingBullets(iaDoc.content, '### 2.1 Public Site')
    .map((line) => line.split(/\s{2,}/)[0] || line)
    .filter((line) => line.startsWith('/')),
  monetization: extractCurrency(copyDoc.content),
  retention: {
    maxNotificationsPerDay: parseNotificationCap(retentionDoc.content),
    antiAddictionGuardrailHeading: '## 8. Anti-Addiction Guardrails',
  },
  governance: {
    executiveSafeguards: extractHeadingBullets(executiveDoc.content, '### 1.2 Governance by Default, Not by Opt-In'),
    qaForbiddenTerms: parseForbiddenTerms(qaDoc.content),
    nonDiagnosticClause:
      'This assessment is designed for development and coaching. It is not a diagnostic tool.',
  },
  tone: {
    lockFile: promptDoc.file_name,
    warmAuthority: true,
    noTherapyVoice: /No therapy voice/i.test(promptDoc.content),
    noCorporateVoice: /No corporate voice/i.test(promptDoc.content),
    noShame: /No shame/i.test(promptDoc.content),
  },
};

export function findDataArchitectureRowsByPage(pageNameIncludes: string): Record<string, string>[] {
  const target = pageNameIncludes.toLowerCase();
  return integratedDataArchitecture.filter((row) =>
    (row['Page Name'] || '').toLowerCase().includes(target)
  );
}

export function findRoadmapByPhase(phaseIncludes: string): Record<string, string>[] {
  const target = phaseIncludes.toLowerCase();
  return integratedRoadmap.filter((row) =>
    (row.Phase || '').toLowerCase().includes(target)
  );
}

export function runDriftCheck(strings: string[]): {
  violations: Array<{ term: string; source: string }>;
  passed: boolean;
} {
  const violations: Array<{ term: string; source: string }> = [];
  const terms = integratedPolicies.governance.qaForbiddenTerms;

  strings.forEach((source) => {
    const normalized = source.toLowerCase();
    terms.forEach((term) => {
      if (normalized.includes(term.toLowerCase())) {
        violations.push({ term, source: source.slice(0, 160) });
      }
    });
  });

  return { violations, passed: violations.length === 0 };
}
