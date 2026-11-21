import type { Progress } from '../types';
import { db } from './index';

export function createProgress(problemId: string, updatedAt: string): Progress {
  return {
    problemId,
    status: 'todo',
    isStarred: false,
    note: '',
    solvedAt: null,
    nextReviewAt: null,
    reviewStep: 0,
    updatedAt,
  };
}

export async function updateProgress(
  problemIds: string[],
  change: (current: Progress, now: Date) => Partial<Omit<Progress, 'problemId' | 'updatedAt'>>,
) {
  const ids = [...new Set(problemIds)];
  await db.transaction('rw', db.progress, async () => {
    const existing = await db.progress.bulkGet(ids);
    const now = new Date();
    const updatedAt = now.toISOString();
    await db.progress.bulkPut(ids.map((id, index) => {
      const current = existing[index] ?? createProgress(id, updatedAt);
      return { ...current, ...change(current, now), updatedAt };
    }));
  });
}

function isDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function isProgress(value: unknown): value is Progress {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.problemId === 'string' && record.problemId.trim().length > 0 &&
    (record.status === 'todo' || record.status === 'tried' ||
      record.status === 'solved' || record.status === 'revise') &&
    typeof record.isStarred === 'boolean' && typeof record.note === 'string' &&
    (record.solvedAt === null || isDate(record.solvedAt)) &&
    (record.nextReviewAt === null || isDate(record.nextReviewAt)) &&
    typeof record.reviewStep === 'number' && Number.isSafeInteger(record.reviewStep) &&
    record.reviewStep >= 0 && isDate(record.updatedAt);
}

export async function exportBackup(): Promise<string> {
  const records = await db.progress.toArray();
  return JSON.stringify({
    version: '2.0',
    exportedAt: new Date().toISOString(),
    totalRecords: records.length,
    records,
  }, null, 2);
}

export async function importBackup(json: string): Promise<number> {
  const backup: { records?: unknown } | null = JSON.parse(json);
  const records = backup?.records;
  if (!Array.isArray(records) || !records.every(isProgress) ||
      new Set(records.map((record) => record.problemId)).size !== records.length) {
    throw new Error('Invalid progress records in backup.');
  }

  const normalizedRecords = records.map((record) => ({
    ...record,
    solvedAt: record.solvedAt === null ? null : new Date(record.solvedAt).toISOString(),
    nextReviewAt: record.nextReviewAt === null ? null : new Date(record.nextReviewAt).toISOString(),
    updatedAt: new Date(record.updatedAt).toISOString(),
  }));
  await db.transaction('rw', db.progress, () => db.progress.bulkPut(normalizedRecords));
  return records.length;
}
