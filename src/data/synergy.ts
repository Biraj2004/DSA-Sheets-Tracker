import { allSheets } from './sheets';
import type { Progress } from '../types';

export interface SheetOverlapInfo {
  targetSheetId: string;
  targetSheetName: string;
  sharedCount: number;
  solvedSharedCount: number;
  percentageOfTarget: number;
}

// Computes overlap between a source sheet and all other sheets
export function getSheetSynergy(
  sourceSheetId: string,
  progressMap: Map<string, Progress>
): SheetOverlapInfo[] {
  const sourceSheet = allSheets.find((s) => s.sheet.id === sourceSheetId);
  if (!sourceSheet) return [];

  const sourceProblemIds = new Set(sourceSheet.items.map((i) => i.problemId));

  const results: SheetOverlapInfo[] = [];

  allSheets.forEach((otherSheet) => {
    if (otherSheet.sheet.id === sourceSheetId) return;

    const otherProblemIds = new Set(otherSheet.items.map((i) => i.problemId));
    let sharedCount = 0;
    let solvedSharedCount = 0;

    otherProblemIds.forEach((pid) => {
      if (sourceProblemIds.has(pid)) {
        sharedCount++;
        if (progressMap.get(pid)?.status === 'solved') {
          solvedSharedCount++;
        }
      }
    });

    if (sharedCount > 0) {
      const percentageOfTarget = Math.round(
        (sharedCount / otherSheet.items.length) * 100
      );

      results.push({
        targetSheetId: otherSheet.sheet.id,
        targetSheetName: otherSheet.sheet.name,
        sharedCount,
        solvedSharedCount,
        percentageOfTarget,
      });
    }
  });

  // Sort by highest shared count
  return results.sort((a, b) => b.sharedCount - a.sharedCount);
}
