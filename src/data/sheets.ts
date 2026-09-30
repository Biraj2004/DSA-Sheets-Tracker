import type { Problem, SheetData, Sheet } from '../types';
import problemsRaw from './problems.json';
import striverRaw from './striver-a2z.json';
import babbarRaw from './love-babbar-450.json';
import neetcode150Raw from './neetcode-150.json';
import neetcode250Raw from './neetcode-250.json';
import apnaCollegeRaw from './apna-college.json';

export const allProblems: Problem[] = problemsRaw as Problem[];
export const problemMap = new Map<string, Problem>(
  allProblems.map((p) => [p.id, p])
);

export const striverSheet: SheetData = striverRaw as SheetData;
export const babbarSheet: SheetData = babbarRaw as SheetData;
export const neetcode150Sheet: SheetData = neetcode150Raw as SheetData;
export const neetcode250Sheet: SheetData = neetcode250Raw as SheetData;
export const apnaCollegeSheet: SheetData = apnaCollegeRaw as SheetData;

export const allSheets: SheetData[] = [
  striverSheet,
  neetcode150Sheet,
  neetcode250Sheet,
  babbarSheet,
  apnaCollegeSheet,
];

export const sheetList: Sheet[] = allSheets.map((s) => s.sheet);

// Map of problemId -> array of sheet short labels where this problem appears
export const problemSheetMap = new Map<string, { id: string; name: string }[]>();

allSheets.forEach((sheetData) => {
  sheetData.items.forEach((item) => {
    const list = problemSheetMap.get(item.problemId) || [];
    if (!list.some((s) => s.id === sheetData.sheet.id)) {
      list.push({ id: sheetData.sheet.id, name: sheetData.sheet.name });
    }
    problemSheetMap.set(item.problemId, list);
  });
});

export function getProblem(id: string): Problem | undefined {
  return problemMap.get(id);
}

export function getSheetData(sheetId: string): SheetData | undefined {
  return allSheets.find((s) => s.sheet.id === sheetId);
}

export function getOtherSheetsForProblem(
  problemId: string,
  currentSheetId?: string
): { id: string; name: string }[] {
  const list = problemSheetMap.get(problemId) || [];
  if (!currentSheetId) return list;
  return list.filter((s) => s.id !== currentSheetId);
}
