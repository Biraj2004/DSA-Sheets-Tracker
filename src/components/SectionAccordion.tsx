import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  CheckCheck,
  RotateCcw,
  MoreHorizontal,
} from 'lucide-react';
import type { Section, SheetItem, Progress, Status } from '../types';
import { getProblem } from '../data/sheets';
import { ProblemRow } from './ProblemRow';

interface SectionAccordionProps {
  section: Section;
  items: SheetItem[];
  progressMap: Map<string, Progress>;
  currentSheetId: string;
  onToggleSolved: (id: string) => void;
  onSetStatus: (id: string, status: Status) => void;
  onToggleStar: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onScheduleReview: (id: string, daysAhead: number) => void;
  onMarkSectionSolved?: (problemIds: string[]) => void;
  onResetSection?: (problemIds: string[]) => void;
  defaultOpen?: boolean;
  isActiveStep?: boolean;
  onActivate?: () => void;
}

export const SectionAccordion: React.FC<SectionAccordionProps> = React.memo(({
  section,
  items,
  progressMap,
  currentSheetId,
  onToggleSolved,
  onSetStatus,
  onToggleStar,
  onSaveNote,
  onScheduleReview,
  onMarkSectionSolved,
  onResetSection,
  defaultOpen = true,
  isActiveStep = false,
  onActivate,
}) => {
  const [userToggled, setUserToggled] = useState<boolean | null>(null);
  const isOpen = userToggled !== null ? userToggled : (defaultOpen || isActiveStep);
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleOpen = () => {
    const next = !isOpen;
    setUserToggled(next);
    if (next && onActivate) {
      onActivate();
    }
  };

  const total = items.length;
  let solved = 0;
  items.forEach((item) => {
    if (progressMap.get(item.problemId)?.status === 'solved') {
      solved++;
    }
  });

  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
  const isAllSolved = total > 0 && solved === total;

  const itemProblemIds = items.map((i) => i.problemId);

  const handleMarkAllSolved = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onMarkSectionSolved) {
      onMarkSectionSolved(itemProblemIds);
    }
  };

  const handleResetSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (window.confirm(`Reset progress for all ${total} problems in "${section.title}"?`)) {
      if (onResetSection) {
        onResetSection(itemProblemIds);
      }
    }
  };

  if (total === 0) return null;

  return (
    <div
      id={section.id}
      className={`bg-slate-900/40 html-light:bg-white border rounded-xl mb-3 transition-all scroll-mt-16 sm:scroll-mt-38 md:scroll-mt-32 ${
        isActiveStep
          ? 'border-indigo-500/60 html-light:border-indigo-400 ring-1 ring-indigo-500/20 html-light:ring-indigo-400/20 shadow-xs'
          : 'border-slate-800 html-light:border-slate-200'
      }`}
    >
      {/* Section Header Trigger */}
      <div
        onClick={handleToggleOpen}
        className="w-full flex items-center justify-between p-3.5 sm:px-5 sm:py-3.5 text-left bg-slate-900/60 hover:bg-slate-900/90 html-light:bg-slate-50 html-light:hover:bg-slate-100 transition-colors cursor-pointer select-none rounded-t-xl"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggleOpen();
          }
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          <span className="font-semibold text-sm sm:text-base text-slate-100 html-light:text-slate-900 truncate">
            {section.title}
          </span>
          {isActiveStep && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 html-light:bg-indigo-50 text-indigo-300 html-light:text-indigo-600 border border-indigo-500/30 html-light:border-indigo-200 shrink-0 select-none">
              Current Step
            </span>
          )}
        </div>

        {/* Progress Metrics & Batch Actions */}
        <div
          className="flex items-center gap-2.5 shrink-0 ml-2"
          onClick={(e) => e.stopPropagation()}
        >
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

          {/* Batch Actions Dropdown */}
          {(onMarkSectionSolved || onResetSection) && (
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Section actions"
                aria-label="Section actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-slate-900 border border-slate-700/80 rounded-lg shadow-xl py-1 z-40 text-xs">
                    {onMarkSectionSolved && (
                      <button
                        type="button"
                        onClick={handleMarkAllSolved}
                        className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mark all solved</span>
                      </button>
                    )}
                    {onResetSection && (
                      <button
                        type="button"
                        onClick={handleResetSection}
                        className="w-full px-3 py-2 text-left text-rose-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                        <span>Reset section</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Problem Items List — sorted Easy → Medium → Hard */}
      {isOpen && (
        <div className="divide-y divide-slate-800/80">
          {[...items]
            .sort((a, b) => {
              const order: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
              const pa = getProblem(a.problemId);
              const pb = getProblem(b.problemId);
              const da = pa?.difficulty ? (order[pa.difficulty.toLowerCase().trim()] ?? 3) : 3;
              const db = pb?.difficulty ? (order[pb.difficulty.toLowerCase().trim()] ?? 3) : 3;
              if (da !== db) return da - db;
              return a.position - b.position;
            })
            .map((item) => {
            const prob = getProblem(item.problemId);
            if (!prob) return null;
            const progress = progressMap.get(item.problemId) || {
              problemId: item.problemId,
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
                key={`${item.sheetId}-${item.sectionId}-${item.problemId}`}
                problem={prob}
                titleInSheet={item.titleInSheet}
                currentSheetId={currentSheetId}
                progress={progress}
                onToggleSolved={(id) => {
                  onActivate?.();
                  onToggleSolved(id);
                }}
                onSetStatus={(id, status) => {
                  onActivate?.();
                  onSetStatus(id, status);
                }}
                onToggleStar={(id) => {
                  onActivate?.();
                  onToggleStar(id);
                }}
                onSaveNote={(id, note) => {
                  onActivate?.();
                  onSaveNote(id, note);
                }}
                onScheduleReview={(id, daysAhead) => {
                  onActivate?.();
                  onScheduleReview(id, daysAhead);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
});
