import { useState, useEffect, useCallback, useMemo } from 'react';
import { liveQuery } from 'dexie';
import { db } from '../db';
import type { Progress, Status } from '../types';
import { allSheets } from '../data/sheets';
import { createProgress, exportBackup, importBackup, updateProgress } from '../db/progress';

const DAY_MS = 24 * 60 * 60 * 1000;

function statusChange(current: Progress | undefined, status: Status, now: Date) {
  const solved = status === 'solved';
  return {
    status,
    solvedAt: solved ? current?.solvedAt ?? now.toISOString() : null,
    nextReviewAt: solved ? current?.nextReviewAt ?? new Date(now.getTime() + 3 * DAY_MS).toISOString() : null,
    reviewStep: solved ? Math.max(1, current?.reviewStep ?? 0) : 0,
  };
}

export function useProgress() {
  const [progressMap, setProgressMap] = useState<Map<string, Progress>>(new Map());
  const [loading, setLoading] = useState(true);

  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const subscription = liveQuery(async () => {
      const records = await db.progress.toArray();
      return new Map(records.map((record) => [record.problemId, record]));
    }).subscribe({
      next: (map) => {
        setProgressMap(map);
        setLoading(false);
      },
      error: (error) => {
        console.error('Could not load progress:', error);
        setStorageError('Could not load your saved progress. Reload the tracker to retry.');
        setLoading(false);
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  const getProgress = useCallback(
    (id: string) => progressMap.get(id) ?? createProgress(id, new Date().toISOString()),
    [progressMap],
  );

  const writeProgress = useCallback(async (...args: Parameters<typeof updateProgress>) => {
    try {
      await updateProgress(...args);
      setStorageError(null);
    } catch (error) {
      console.error('Could not save progress:', error);
      setStorageError('Could not save your last progress change. Please try again.');
    }
  }, []);

  const toggleSolved = (id: string) =>
    writeProgress([id], (current, now) =>
      current.status === 'solved'
        ? statusChange(current, 'todo', now)
        : statusChange(undefined, 'solved', now),
    );

  const setStatus = (id: string, status: Status) =>
    writeProgress([id], (current, now) => statusChange(current, status, now));

  const toggleStar = (id: string) =>
    writeProgress([id], (current) => ({ isStarred: !current.isStarred }));

  const saveNote = (id: string, note: string) =>
    writeProgress([id], () => ({ note }));

  const scheduleReview = (id: string, days: number) =>
    writeProgress([id], (current, now) => ({
      nextReviewAt: new Date(now.getTime() + days * DAY_MS).toISOString(),
      reviewStep: current.reviewStep + 1,
    }));

  const markSectionSolved = (ids: string[]) =>
    writeProgress(ids, (current, now) => statusChange(current, 'solved', now));

  const resetSection = (ids: string[]) =>
    writeProgress(ids, (current, now) => statusChange(current, 'todo', now));

  const resetAllData = useCallback(async () => {
    await db.progress.clear();
  }, []);

  // Today solved count
  const todaySolvedCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    let count = 0;
    progressMap.forEach((p) => {
      if (p.status === 'solved' && p.solvedAt && p.solvedAt.startsWith(today)) {
        count++;
      }
    });
    return count;
  }, [progressMap]);

  // Global solved count
  const globalSolvedCount = useMemo(() => {
    let count = 0;
    progressMap.forEach((p) => {
      if (p.status === 'solved') count++;
    });
    return count;
  }, [progressMap]);

  // Global starred count
  const globalStarredCount = useMemo(() => {
    let count = 0;
    progressMap.forEach((p) => {
      if (p.isStarred) count++;
    });
    return count;
  }, [progressMap]);

  // Sheet progress statistics
  const getSheetStats = useCallback(
    (sheetId: string) => {
      const sheet = allSheets.find((s) => s.sheet.id === sheetId);
      if (!sheet) return { total: 0, solved: 0, percentage: 0 };

      const total = sheet.items.length;
      let solved = 0;
      sheet.items.forEach((item) => {
        if (progressMap.get(item.problemId)?.status === 'solved') {
          solved++;
        }
      });
      const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
      return { total, solved, percentage };
    },
    [progressMap]
  );

  // Section progress statistics
  const getSectionStats = useCallback(
    (sheetId: string, sectionId: string) => {
      const sheet = allSheets.find((s) => s.sheet.id === sheetId);
      if (!sheet) return { total: 0, solved: 0, percentage: 0 };

      const sectionItems = sheet.items.filter((i) => i.sectionId === sectionId);
      const total = sectionItems.length;
      let solved = 0;
      sectionItems.forEach((item) => {
        if (progressMap.get(item.problemId)?.status === 'solved') {
          solved++;
        }
      });
      const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
      return { total, solved, percentage };
    },
    [progressMap]
  );

  return {
    progressMap,
    loading,
    storageError,
    getProgress,
    toggleSolved,
    setStatus,
    toggleStar,
    saveNote,
    scheduleReview,
    markSectionSolved,
    resetSection,
    resetAllData,
    exportBackup,
    importBackup,
    todaySolvedCount,
    globalSolvedCount,
    globalStarredCount,
    getSheetStats,
    getSectionStats,
  };
}
