import { allProblems, allSheets } from './sheets';

/**
 * Single source of truth for every headline number shown in the UI
 * (header, master catalog, 404 page, contact page, footer…).
 *
 * Everything here is derived from the canonical registry at module load,
 * so adding/removing a problem or sheet JSON entry updates all pages at once.
 * Never hard-code these figures in JSX — import them from here instead.
 */

const premiumProblems = allProblems.filter((p) => p.isLeetCodePremium);

export const TRACKER_STATS = {
  /** Unique problems in the canonical registry (problems.json). */
  totalProblems: allProblems.length,
  /** Number of curated sheets. */
  sheetCount: allSheets.length,
  /** LeetCode Premium problems in the registry. */
  premiumCount: premiumProblems.length,
  /** Premium problems that route to a free alternative. */
  premiumWithFreeAltCount: premiumProblems.filter((p) => !!p.altUrl).length,
} as const;

/** Locale-formatted total, e.g. "1,041". */
export const formatCount = (n: number): string => n.toLocaleString('en-US');

/** Human-readable sheet names, e.g. "Pattern-Wise, Striver A2Z … and Apna College". */
export function listSheetNames(shortNames?: Record<string, string>): string {
  const names = allSheets.map((s) => shortNames?.[s.sheet.id] ?? s.sheet.name);
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

/** Actual number of problems placed in a given sheet (not the declared `expectedCount`). */
export function getSheetProblemCount(sheetId: string): number {
  return allSheets.find((s) => s.sheet.id === sheetId)?.items.length ?? 0;
}
