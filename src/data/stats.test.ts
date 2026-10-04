import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import problemsRaw from './problems.json';
import { allSheets } from './sheets';
import { TRACKER_STATS, formatCount, getSheetProblemCount, listSheetNames } from './stats';

describe('TRACKER_STATS (single source of truth for UI metrics)', () => {
  it('matches the raw registry and sheet files', () => {
    expect(TRACKER_STATS.totalProblems).toBe(problemsRaw.length);
    expect(TRACKER_STATS.sheetCount).toBe(allSheets.length);

    const premium = (problemsRaw as { isLeetCodePremium?: boolean }[]).filter((p) => p.isLeetCodePremium);
    expect(TRACKER_STATS.premiumCount).toBe(premium.length);
    expect(TRACKER_STATS.premiumWithFreeAltCount).toBeLessThanOrEqual(TRACKER_STATS.premiumCount);
  });

  it('reports per-sheet counts from real items', () => {
    for (const s of allSheets) {
      expect(getSheetProblemCount(s.sheet.id)).toBe(s.items.length);
    }
    expect(getSheetProblemCount('does-not-exist')).toBe(0);
  });

  it('formats counts and sheet name lists', () => {
    expect(formatCount(1041)).toBe('1,041');
    const list = listSheetNames();
    expect(list).toContain(', and ');
    for (const s of allSheets) expect(list).toContain(s.sheet.name);
  });
});

describe('UI copy does not hard-code dataset totals', () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) => {
      const p = join(dir, f);
      return statSync(p).isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : [];
    });

  it('has no literal problem/premium totals in any component or page', () => {
    const banned = [
      TRACKER_STATS.totalProblems.toLocaleString('en-US'), // e.g. 1,041
      String(TRACKER_STATS.totalProblems),
      '1,003',
    ];
    const root = join(__dirname, '..');
    const offenders: string[] = [];
    for (const file of walk(join(root, 'components')).concat(walk(join(root, 'pages')))) {
      const src = readFileSync(file, 'utf8');
      for (const b of banned) if (src.includes(b)) offenders.push(`${file}: "${b}"`);
    }
    expect(offenders).toEqual([]);
  });
});
