import 'fake-indexeddb/auto';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { db } from './index';
import { exportBackup, importBackup, updateProgress } from './progress';
import type { Progress } from '../types';

const record: Progress = {
  problemId: 'lc-two-sum',
  status: 'todo',
  isStarred: false,
  note: 'Original note',
  solvedAt: null,
  nextReviewAt: null,
  reviewStep: 0,
  updatedAt: '2026-01-01T00:00:00.000Z',
};

beforeEach(async () => {
  await db.progress.clear();
  await db.progress.put(record);
});

afterAll(() => db.delete());

describe('progress storage', () => {
  it('rejects a malformed backup before replacing any records', async () => {
    const backup = JSON.stringify({
      records: [{ ...record, note: 'Replaced' }, { ...record, problemId: 'another', note: 42 }],
    });
    await expect(importBackup(backup)).rejects.toThrow();
    expect(await db.progress.toArray()).toEqual([record]);
  });

  it('restores exported records alongside other saved progress', async () => {
    const backup = await exportBackup();
    const other = { ...record, problemId: 'retired-problem' };
    await db.progress.clear();
    await db.progress.put(other);
    await expect(importBackup(backup)).resolves.toBe(1);
    expect(await db.progress.toArray()).toEqual([record, other]);
  });

  it('preserves independent changes from overlapping writes', async () => {
    await Promise.all([
      updateProgress([record.problemId], () => ({ isStarred: true })),
      updateProgress([record.problemId], () => ({ note: 'Changed note' })),
    ]);
    expect(await db.progress.get(record.problemId)).toMatchObject({
      isStarred: true,
      note: 'Changed note',
    });
  });
});
