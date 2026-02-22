/**
 * inspect-excel.ts
 *
 * Reads the STEP5B, STEP4B, and STEP4C Excel files and prints
 * sheet names, column headers, and row counts so we know the
 * exact structure before writing the parser.
 *
 * Usage: npx tsx scripts/inspect-excel.ts
 */

import * as XLSX from 'xlsx';
import * as path from 'path';

const BASE = path.resolve(__dirname, '../../05_DATASETS');

function inspectWorkbook(filename: string) {
  const filepath = path.join(BASE, filename);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`FILE: ${filename}`);
  console.log('='.repeat(60));

  const wb = XLSX.readFile(filepath);

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: null });

    console.log(`\n  SHEET: "${sheetName}" — ${data.length} rows`);

    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      console.log(`  COLUMNS (${headers.length}): ${headers.join(', ')}`);

      // Print first 2 rows as sample
      for (let i = 0; i < Math.min(2, data.length); i++) {
        console.log(`  ROW ${i}: ${JSON.stringify(data[i]).slice(0, 200)}`);
      }
    }
  }
}

// Inspect all three Excel files
inspectWorkbook('STEP5B_ItemBank_Hardened_MASTER.xlsx');
inspectWorkbook('STEP4B_ARCHETYPE_QUALIFICATION_RULES.xlsx');
inspectWorkbook('STEP4C_EXECUTIVE_METADATA_MASTER.xlsx');
