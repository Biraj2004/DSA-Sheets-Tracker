import React, { useState, useMemo } from 'react';
import type { Problem, Progress, Status } from '../types';
import { ProblemRow } from './ProblemRow';
import { FilterBar, type FilterState } from './FilterBar';
import {
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  BookOpen,
  CheckCircle2,
  ListFilter,
} from 'lucide-react';

interface AllProblemsViewProps {
  problems: Problem[];
  progressMap: Map<string, Progress>;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onToggleSolved: (id: string) => void;
  onSetStatus: (id: string, status: Status) => void;
  onToggleStar: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onScheduleReview: (id: string, daysAhead: number) => void;
}

const CANONICAL_TOPIC_ORDER = [
  'Basics & Patterns',
  'Arrays & Vectors',
  '2D Arrays & Matrix',
  'Strings',
  'Searching & Sorting',
  'Two Pointers & Sliding Window',
  'Linked Lists',
  'Stacks & Queues',
  'Binary Trees',
  'Binary Search Trees',
  'Heaps & Priority Queues',
  'Recursion & Backtracking',
  'Greedy Algorithms',
  'Dynamic Programming',
  'Graphs',
  'Tries',
  'Bit Manipulation',
  'Math & Number Theory',
];

const DIFF_WEIGHT: Record<string, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

function sortProblemsByDifficulty(a: Problem, b: Problem): number {
  const diffA = DIFF_WEIGHT[a.difficulty?.toLowerCase() || 'medium'] ?? 1;
  const diffB = DIFF_WEIGHT[b.difficulty?.toLowerCase() || 'medium'] ?? 1;
  if (diffA !== diffB) {
    return diffA - diffB;
  }
  return a.title.localeCompare(b.title);
}

interface TopicGroupProps {
  topicName: string;
  problems: Problem[];
  progressMap: Map<string, Progress>;
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleSolved: (id: string) => void;
  onSetStatus: (id: string, status: Status) => void;
  onToggleStar: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onScheduleReview: (id: string, daysAhead: number) => void;
}

const TopicAccordion: React.FC<TopicGroupProps> = React.memo(({
  topicName,
  problems,
  progressMap,
  isOpen,
  onToggleOpen,
  onToggleSolved,
  onSetStatus,
  onToggleStar,
  onSaveNote,
  onScheduleReview,
}) => {
  const total = problems.length;
  let solved = 0;
  let easyCount = 0;
  let medCount = 0;
  let hardCount = 0;

  problems.forEach((p) => {
    if (progressMap.get(p.id)?.status === 'solved') {
      solved++;
    }
    const d = (p.difficulty || '').toLowerCase();
    if (d === 'easy') easyCount++;
    else if (d === 'hard') hardCount++;
    else medCount++;
  });

  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
  const isAllSolved = total > 0 && solved === total;

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl mb-3 transition-all overflow-hidden">
      {/* Header */}
      <div
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between p-3.5 sm:px-5 sm:py-3.5 text-left bg-slate-900/60 hover:bg-slate-900/90 transition-colors cursor-pointer select-none"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleOpen();
          }
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          <span className="font-semibold text-sm sm:text-base text-slate-100 truncate">
            {topicName}
          </span>

          {/* Difficulty counts pills */}
          <div className="hidden md:flex items-center gap-1.5 ml-2">
            {easyCount > 0 && (
              <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400/90 border border-emerald-500/20">
                {easyCount} Easy
              </span>
            )}
            {medCount > 0 && (
              <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400/90 border border-amber-500/20">
                {medCount} Med
              </span>
            )}
            {hardCount > 0 && (
              <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400/90 border border-rose-500/20">
                {hardCount} Hard
              </span>
            )}
          </div>
        </div>

        {/* Progress Metrics */}
        <div className="flex items-center gap-2.5 shrink-0 ml-2">
          {/* Progress bar */}
          <div className="w-16 sm:w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
            <div
              className={`h-full transition-all duration-300 ${
                isAllSolved ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <span
            className={`text-xs font-mono-num font-medium px-2 py-0.5 rounded-full ${
              isAllSolved
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {solved}/{total}
          </span>
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="divide-y divide-slate-800/80 border-t border-slate-800/60">
          {problems.map((prob) => {
            const progress = progressMap.get(prob.id) || {
              problemId: prob.id,
              status: 'todo',
              isStarred: false,
              note: '',
              solvedAt: null,
              nextReviewAt: null,
              reviewStep: 0,
              updatedAt: '',
            };

            return (
              <ProblemRow
                key={prob.id}
                problem={prob}
                progress={progress}
                onToggleSolved={onToggleSolved}
                onSetStatus={onSetStatus}
                onToggleStar={onToggleStar}
                onSaveNote={onSaveNote}
                onScheduleReview={onScheduleReview}
              />
            );
          })}
        </div>
      )}
    </div>
  );
});

TopicAccordion.displayName = 'TopicAccordion';

export const AllProblemsView: React.FC<AllProblemsViewProps> = ({
  problems,
  progressMap,
  filters,
  onFilterChange,
  onToggleSolved,
  onSetStatus,
  onToggleStar,
  onSaveNote,
  onScheduleReview,
}) => {
  // Global collapse / expand state
  const [collapsedTopics, setCollapsedTopics] = useState<Record<string, boolean>>({});

  // Filter logic
  const filteredProblems = useMemo(() => {
    return problems.filter((prob) => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const matchTitle = prob.title.toLowerCase().includes(q);
        const matchTopic = prob.topics?.some((t) => t.toLowerCase().includes(q)) ?? false;
        const matchPlatform = prob.platform?.toLowerCase().includes(q) ?? false;
        const matchCategory = prob.category?.toLowerCase().includes(q) ?? false;
        if (!matchTitle && !matchTopic && !matchPlatform && !matchCategory) return false;
      }

      // Difficulty
      if (filters.difficulty !== 'all' && prob.difficulty !== filters.difficulty) {
        return false;
      }

      // Platform
      if (filters.platform !== 'all' && prob.platform !== filters.platform) {
        return false;
      }

      // Status
      const prog = progressMap.get(prob.id);
      if (filters.status === 'starred') {
        if (!prog?.isStarred) return false;
      } else if (filters.status !== 'all') {
        const currentStatus = prog?.status || 'todo';
        if (currentStatus !== filters.status) return false;
      }

      return true;
    });
  }, [problems, filters, progressMap]);

  // Group and sort problems topicwise (Easy -> Medium -> Hard)
  const topicGroups = useMemo(() => {
    const map = new Map<string, Problem[]>();

    // Initialize all canonical topics to preserve logical order
    CANONICAL_TOPIC_ORDER.forEach((topic) => {
      map.set(topic, []);
    });

    // Distribute problems into categories
    filteredProblems.forEach((p) => {
      const cat = p.category || 'Arrays & Vectors';
      const list = map.get(cat);
      if (list) {
        list.push(p);
      } else {
        map.set(cat, [p]);
      }
    });

    // Sort problems in each category: Easy -> Medium -> Hard
    const result: { topicName: string; problems: Problem[] }[] = [];
    map.forEach((pList, topicName) => {
      if (pList.length > 0) {
        pList.sort(sortProblemsByDifficulty);
        result.push({ topicName, problems: pList });
      }
    });

    return result;
  }, [filteredProblems]);

  // Toggle individual topic open/close
  const toggleTopic = (topicName: string) => {
    setCollapsedTopics((prev) => ({
      ...prev,
      [topicName]: !prev[topicName],
    }));
  };

  // Check if search is active (auto-expand during search)
  const isSearchActive = !!filters.search?.trim();

  // Total solved in master catalog
  const totalSolved = useMemo(() => {
    let count = 0;
    problems.forEach((p) => {
      if (progressMap.get(p.id)?.status === 'solved') {
        count++;
      }
    });
    return count;
  }, [problems, progressMap]);

  // Expand all / collapse all
  const areAllExpanded = topicGroups.every((g) => !collapsedTopics[g.topicName]);
  const toggleAll = () => {
    if (areAllExpanded) {
      const next: Record<string, boolean> = {};
      topicGroups.forEach((g) => {
        next[g.topicName] = true;
      });
      setCollapsedTopics(next);
    } else {
      setCollapsedTopics({});
    }
  };

  return (
    <div>
      {/* Dynamic Header Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Master Catalog ({problems.length.toLocaleString()} Canonical Problems)
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Topic-wise curated global catalog across all 5 sheets (Striver A2Z, NeetCode 150/250, Love Babbar, and Apna College). Problems in each topic are organized from Easy &rarr; Medium &rarr; Hard.
            </p>
          </div>

          {/* Catalog Progress Pill */}
          <div className="flex items-center gap-2 shrink-0 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400">Total Solved: </span>
              <span className="font-semibold text-emerald-300 font-mono-num">
                {totalSolved}
              </span>
              <span className="text-slate-500"> / {problems.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Non-destructive Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        filteredCount={filteredProblems.length}
        totalCount={problems.length}
      />

      {/* Controls Bar: Topic Count & Expand/Collapse Toggle */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ListFilter className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            {topicGroups.length} {topicGroups.length === 1 ? 'Topic' : 'Topics'} &bull;{' '}
            <span className="text-slate-300 font-mono-num font-medium">
              {filteredProblems.length}
            </span>{' '}
            Problems
          </span>
        </div>

        {topicGroups.length > 0 && (
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors px-2 py-1 rounded bg-slate-900/60 border border-slate-800 hover:border-slate-700 select-none"
          >
            <ChevronsUpDown className="w-3.5 h-3.5" />
            <span>{areAllExpanded ? 'Collapse All' : 'Expand All'}</span>
          </button>
        )}
      </div>

      {/* Topic-wise Segregated Accordions */}
      {topicGroups.length > 0 ? (
        <div>
          {topicGroups.map(({ topicName, problems: topicProblems }) => {
            const isCollapsed = collapsedTopics[topicName] ?? false;
            // When search is active, keep everything open so user sees results
            const isOpen = isSearchActive ? true : !isCollapsed;

            return (
              <TopicAccordion
                key={topicName}
                topicName={topicName}
                problems={topicProblems}
                progressMap={progressMap}
                isOpen={isOpen}
                onToggleOpen={() => toggleTopic(topicName)}
                onToggleSolved={onToggleSolved}
                onSetStatus={onSetStatus}
                onToggleStar={onToggleStar}
                onSaveNote={onSaveNote}
                onScheduleReview={onScheduleReview}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
          No problems match your current filter criteria.
        </div>
      )}
    </div>
  );
};
