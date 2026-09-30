// Where a problem is hosted. Filled in by code from the link, never typed by hand.
export type Platform =
  | 'leetcode'
  | 'gfg'
  | 'tuf'
  | 'codingninjas'
  | 'spoj'
  | 'hackerearth'
  | 'interviewbit'
  | 'other'
  | 'concept';

export type Status = 'todo' | 'tried' | 'solved' | 'revise';

export type Difficulty = 'easy' | 'medium' | 'hard' | null;

export type Problem = {
  id: string; // like "lc-two-sum"
  title: string;
  platform: Platform;
  url: string | null; // empty only for concept questions
  difficulty: Difficulty;
  topics: string[];
  check: 'ok' | 'unchecked' | 'broken';
  checkedAt: string | null;
  // Smart routing fields
  tufUrl?: string | null;          // TUF+ link (primary for premium/Step1, secondary for LC/GFG)
  isLeetCodePremium?: boolean;     // true = LC problem requires subscription
  altUrl?: string | null;          // Alternative/secondary platform URL
  category?: string;               // Canonical DSA Topic Category
};

export type Sheet = {
  id: string; // like "striver-a2z"
  name: string;
  creator: string;
  sourceUrl: string;
  fetchedAt: string;
  expectedCount: number;
};

export type Section = {
  id: string;
  sheetId: string;
  title: string;
  parentId: string | null;
  position: number;
};

// Says which problem sits in which section of which sheet.
export type SheetItem = {
  sheetId: string;
  sectionId: string;
  problemId: string;
  position: number;
  titleInSheet?: string; // only if the sheet uses a different title
};

export type SheetData = {
  sheet: Sheet;
  sections: Section[];
  items: SheetItem[];
};

// Saved on the user's device. One record per problem.
export type Progress = {
  problemId: string;
  status: Status;
  isStarred: boolean;
  note: string;
  solvedAt: string | null;
  nextReviewAt: string | null;
  reviewStep: number;
  updatedAt: string;
};
