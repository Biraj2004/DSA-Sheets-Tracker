import { describe, it, expect } from 'vitest';
import { allSheets, allProblems, problemMap } from './sheets';

describe('DSA Sheets Integrity Test Suite', () => {
  it('should load all 7 sheets with correct expected counts', () => {
    expect(allSheets.length).toBe(7);

    const sheetCounts: Record<string, number> = {
      'striver-a2z': 460,
      'neetcode-250': 250,
      'namaste-dsa': 165,
      'fraz-interview': 327,
      'pattern-wise': 475,
      'love-babbar-450': 453,
      'apna-college': 184,
    };

    allSheets.forEach((sheetData) => {
      const expected = sheetCounts[sheetData.sheet.id];
      expect(expected).toBeDefined();
      expect(sheetData.sheet.expectedCount).toBe(expected);
      expect(sheetData.items.length).toBe(expected);
    });
  });

  it('should have zero dangling problem IDs in any sheet', () => {
    allSheets.forEach((sheetData) => {
      sheetData.items.forEach((item) => {
        const prob = problemMap.get(item.problemId);
        expect(
          prob,
          `Sheet ${sheetData.sheet.id} has dangling problemId: ${item.problemId}`
        ).toBeDefined();
      });
    });
  });

  it('should have zero dangling section IDs in any sheet', () => {
    allSheets.forEach((sheetData) => {
      const sectionIds = new Set(sheetData.sections.map((s) => s.id));
      sheetData.items.forEach((item) => {
        expect(
          sectionIds.has(item.sectionId),
          `Sheet ${sheetData.sheet.id} has dangling sectionId: ${item.sectionId}`
        ).toBe(true);
      });
    });
  });

  it('should verify that no problems point to namastedev.com or learnyard.com practice URLs', () => {
    allProblems.forEach((prob) => {
      const url = prob.url || '';
      expect(url.includes('namastedev.com')).toBe(false);
      expect(url.includes('learnyard.com')).toBe(false);
    });
  });

  it('should verify all problems in problems.json have valid titles and difficulties', () => {
    allProblems.forEach((prob) => {
      expect(prob.id).toBeTruthy();
      expect(prob.title).toBeTruthy();
      expect(prob.platform).toBeTruthy();
      expect(['easy', 'medium', 'hard', null]).toContain(prob.difficulty);
    });
  });
});
