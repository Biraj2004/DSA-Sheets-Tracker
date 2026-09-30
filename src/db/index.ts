import Dexie, { type EntityTable } from 'dexie';
import type { Progress } from '../types';

export interface UserSettings {
  id: string; // 'current'
  theme: 'dark' | 'light';
  activeSheetId: string;
  bypassMobileWarning?: boolean;
}

export const db = new Dexie('DsaTrackerDB') as Dexie & {
  progress: EntityTable<Progress, 'problemId'>;
  settings: EntityTable<UserSettings, 'id'>;
};

// Schema definition: problemId is the primary key.
db.version(1).stores({
  progress: 'problemId, status, isStarred, nextReviewAt, updatedAt',
  settings: 'id',
});
