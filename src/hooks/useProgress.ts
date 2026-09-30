import { useState, useEffect, useCallback, useMemo } from 'react';
import { liveQuery } from 'dexie';
import { db } from '../db';
import type { Progress, Status } from '../types';
import { allSheets } from '../data/sheets';

export function useProgress() {
  const [progressMap, setProgressMap] = useState<Map<string, Progress>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Direct initial query for instant rendering
    db.progress
      .toArray()
      .then((records) => {
        if (mounted) {
          setProgressMap(new Map(records.map((r) => [r.problemId, r])));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Direct Dexie load fallback:', err);
        if (mounted) setLoading(false);
      });

    // Reactive subscription for subsequent updates
    const subscription = liveQuery(async () => {
      const records = await db.progress.toArray();
      return new Map(records.map((r) => [r.problemId, r]));
    }).subscribe({
      next: (map) => {
        if (mounted) {
          setProgressMap(map);
          setLoading(false);
        }
      },
      error: (err) => {
        console.error('Dexie liveQuery error:', err);
        if (mounted) setLoading(false);
      },
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getProgress = useCallback(
    (problemId: string): Progress => {
      return (
        progressMap.get(problemId) || {
          problemId,
          status: 'todo',
          isStarred: false,
          note: '',
          solvedAt: null,
          nextReviewAt: null,
          reviewStep: 0,
          updatedAt: new Date().toISOString(),
        }
      );
    },
    [progressMap]
  );

  const toggleSolved = useCallback(
    async (problemId: string) => {
      const current = progressMap.get(problemId);
      const isCurrentlySolved = current?.status === 'solved';
      const now = new Date().toISOString();

      const updated: Progress = isCurrentlySolved
        ? {
            problemId,
            status: 'todo',
            isStarred: current?.isStarred || false,
            note: current?.note || '',
            solvedAt: null,
            nextReviewAt: null,
            reviewStep: 0,
            updatedAt: now,
          }
        : {
            problemId,
            status: 'solved',
            isStarred: current?.isStarred || false,
            note: current?.note || '',
            solvedAt: now,
            nextReviewAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            reviewStep: 1,
            updatedAt: now,
          };

      // 1. Optimistic state update (0ms UI latency)
      setProgressMap((prev) => {
        const next = new Map(prev);
        next.set(problemId, updated);
        return next;
      });

      // 2. Persistent storage in IndexedDB
      await db.progress.put(updated);
    },
    [progressMap]
  );

  const setStatus = useCallback(
    async (problemId: string, status: Status) => {
      const current = progressMap.get(problemId);
      const now = new Date().toISOString();
      const isSolved = status === 'solved';

      const updated: Progress = {
        problemId,
        status,
        isStarred: current?.isStarred || false,
        note: current?.note || '',
        solvedAt: isSolved ? (current?.solvedAt || now) : null,
        nextReviewAt: isSolved
          ? current?.nextReviewAt || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          : null,
        reviewStep: isSolved ? Math.max(1, current?.reviewStep || 1) : 0,
        updatedAt: now,
      };

      // 1. Optimistic state update
      setProgressMap((prev) => {
        const next = new Map(prev);
        next.set(problemId, updated);
        return next;
      });

      // 2. Persistent storage in IndexedDB
      await db.progress.put(updated);
    },
    [progressMap]
  );

  const toggleStar = useCallback(
    async (problemId: string) => {
      const current = progressMap.get(problemId);
      const now = new Date().toISOString();

      const updated: Progress = {
        problemId,
        status: current?.status || 'todo',
        isStarred: !current?.isStarred,
        note: current?.note || '',
        solvedAt: current?.solvedAt || null,
        nextReviewAt: current?.nextReviewAt || null,
        reviewStep: current?.reviewStep || 0,
        updatedAt: now,
      };

      // 1. Optimistic state update
      setProgressMap((prev) => {
        const next = new Map(prev);
        next.set(problemId, updated);
        return next;
      });

      // 2. Persistent storage in IndexedDB
      await db.progress.put(updated);
    },
    [progressMap]
  );

  const saveNote = useCallback(
    async (problemId: string, note: string) => {
      const current = progressMap.get(problemId);
      const now = new Date().toISOString();

      const updated: Progress = {
        problemId,
        status: current?.status || 'todo',
        isStarred: current?.isStarred || false,
        note,
        solvedAt: current?.solvedAt || null,
        nextReviewAt: current?.nextReviewAt || null,
        reviewStep: current?.reviewStep || 0,
        updatedAt: now,
      };

      // 1. Optimistic state update
      setProgressMap((prev) => {
        const next = new Map(prev);
        next.set(problemId, updated);
        return next;
      });

      // 2. Persistent storage in IndexedDB
      await db.progress.put(updated);
    },
    [progressMap]
  );

  const scheduleReview = useCallback(
    async (problemId: string, daysAhead: number) => {
      const current = progressMap.get(problemId);
      const now = new Date();
      const reviewDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000).toISOString();
      const updatedAt = now.toISOString();

      const updated: Progress = {
        problemId,
        status: current?.status || 'todo',
        isStarred: current?.isStarred || false,
        note: current?.note || '',
        solvedAt: current?.solvedAt || null,
        nextReviewAt: reviewDate,
        reviewStep: (current?.reviewStep || 0) + 1,
        updatedAt,
      };

      // 1. Optimistic state update
      setProgressMap((prev) => {
        const next = new Map(prev);
        next.set(problemId, updated);
        return next;
      });

      // 2. Persistent storage in IndexedDB
      await db.progress.put(updated);
    },
    [progressMap]
  );

  const markSectionSolved = useCallback(
    async (problemIds: string[]) => {
      const now = new Date().toISOString();
      const nextReview = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      const updates = problemIds.map((problemId) => {
        const current = progressMap.get(problemId);
        return {
          problemId,
          status: 'solved' as Status,
          isStarred: current?.isStarred || false,
          note: current?.note || '',
          solvedAt: current?.solvedAt || now,
          nextReviewAt: current?.nextReviewAt || nextReview,
          reviewStep: Math.max(1, current?.reviewStep || 1),
          updatedAt: now,
        };
      });

      // 1. Optimistic state update
      setProgressMap((prev) => {
        const next = new Map(prev);
        updates.forEach((u) => next.set(u.problemId, u));
        return next;
      });

      // 2. Persistent storage in IndexedDB
      await db.progress.bulkPut(updates);
    },
    [progressMap]
  );

  const resetSection = useCallback(
    async (problemIds: string[]) => {
      const now = new Date().toISOString();
      const updates = problemIds.map((problemId) => {
        const current = progressMap.get(problemId);
        return {
          problemId,
          status: 'todo' as Status,
          isStarred: current?.isStarred || false,
          note: current?.note || '',
          solvedAt: null,
          nextReviewAt: null,
          reviewStep: 0,
          updatedAt: now,
        };
      });

      // 1. Optimistic state update
      setProgressMap((prev) => {
        const next = new Map(prev);
        updates.forEach((u) => next.set(u.problemId, u));
        return next;
      });

      // 2. Persistent storage in IndexedDB
      await db.progress.bulkPut(updates);
    },
    [progressMap]
  );

  const resetAllData = useCallback(async () => {
    await db.progress.clear();
  }, []);

  const exportBackup = useCallback(async (): Promise<string> => {
    const allRecords = await db.progress.toArray();
    return JSON.stringify(
      {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        totalRecords: allRecords.length,
        records: allRecords,
      },
      null,
      2
    );
  }, []);

  const importBackup = useCallback(async (jsonString: string): Promise<number> => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.records || !Array.isArray(parsed.records)) {
        throw new Error('Invalid backup file structure.');
      }
      await db.progress.bulkPut(parsed.records);
      return parsed.records.length;
    } catch (err) {
      console.error('Failed to import backup:', err);
      throw err;
    }
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
