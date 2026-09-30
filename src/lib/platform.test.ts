import { describe, it, expect } from 'vitest';
import { getPlatformFromUrl, cleanProblemUrl, generateProblemId } from './platform';

describe('platform helpers', () => {
  describe('getPlatformFromUrl', () => {
    it('identifies LeetCode links', () => {
      expect(getPlatformFromUrl('https://leetcode.com/problems/two-sum/')).toBe('leetcode');
      expect(getPlatformFromUrl('https://leetcode.cn/problems/two-sum/')).toBe('leetcode');
    });

    it('identifies GeeksforGeeks links', () => {
      expect(getPlatformFromUrl('https://www.geeksforgeeks.org/problems/kadanes-algorithm/1')).toBe('gfg');
    });

    it('identifies Coding Ninjas / Naukri links', () => {
      expect(getPlatformFromUrl('https://www.naukri.com/code360/problems/two-sum_8230693')).toBe('codingninjas');
      expect(getPlatformFromUrl('https://www.codingninjas.com/studio/problems/two-sum')).toBe('codingninjas');
    });

    it('identifies SPOJ links', () => {
      expect(getPlatformFromUrl('https://www.spoj.com/problems/AGGRCOW/')).toBe('spoj');
    });

    it('identifies HackerEarth links', () => {
      expect(getPlatformFromUrl('https://www.hackerearth.com/problem/algorithm/painters-partition/')).toBe('hackerearth');
    });

    it('identifies InterviewBit links', () => {
      expect(getPlatformFromUrl('https://www.interviewbit.com/problems/max-sum-contiguous-subarray/')).toBe('interviewbit');
    });

    it('identifies other and concept links', () => {
      expect(getPlatformFromUrl('https://codeforces.com/problemset/problem/1/A')).toBe('other');
      expect(getPlatformFromUrl(null)).toBe('concept');
      expect(getPlatformFromUrl('')).toBe('concept');
      expect(getPlatformFromUrl('   ')).toBe('concept');
    });
  });

  describe('cleanProblemUrl', () => {
    it('removes trailing slashes, www, tracking and /description', () => {
      expect(cleanProblemUrl('https://www.leetcode.com/problems/two-sum/description/?utm_source=dsa#solution'))
        .toBe('https://leetcode.com/problems/two-sum');
      expect(cleanProblemUrl('https://www.geeksforgeeks.org/problems/kadane/1/'))
        .toBe('https://geeksforgeeks.org/problems/kadane/1');
    });

    it('handles empty or invalid inputs', () => {
      expect(cleanProblemUrl(null)).toBeNull();
      expect(cleanProblemUrl('')).toBeNull();
    });
  });

  describe('generateProblemId', () => {
    it('generates consistent canonical IDs', () => {
      expect(generateProblemId('https://leetcode.com/problems/two-sum/', 'Two Sum')).toBe('lc-two-sum');
      expect(generateProblemId('https://leetcode.com/problems/two-sum/description', 'Two Sum')).toBe('lc-two-sum');
      expect(generateProblemId('https://www.geeksforgeeks.org/problems/kadanes-algorithm/1', "Kadane's Algorithm")).toBe('gfg-kadanes-algorithm');
      expect(generateProblemId(null, 'User Input / Output in C++')).toBe('concept-user-input-output-in-c');
    });
  });
});
