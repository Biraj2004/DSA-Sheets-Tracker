import React from 'react';
import { RotateCw, CheckCircle2, Star, Calendar } from 'lucide-react';
import type { Progress, Status } from '../types';
import { getProblem } from '../data/sheets';
import { ProblemRow } from './ProblemRow';

interface RevisionViewProps {
  progressMap: Map<string, Progress>;
  onToggleSolved: (id: string) => void;
  onSetStatus: (id: string, status: Status) => void;
  onToggleStar: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onScheduleReview: (id: string, daysAhead: number) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({
  progressMap,
  onToggleSolved,
  onSetStatus,
  onToggleStar,
  onSaveNote,
  onScheduleReview,
}) => {
  const revisionItems: Progress[] = [];
  const now = new Date().toISOString();

  progressMap.forEach((p) => {
    // Problem is in revision if explicitly marked as revise OR has an active nextReviewAt schedule
    if (p.status === 'revise' || (p.nextReviewAt && p.nextReviewAt <= now) || p.isStarred) {
      revisionItems.push(p);
    }
  });

  // Sort by nextReviewAt ascending (overdue first)
  revisionItems.sort((a, b) => {
    if (!a.nextReviewAt) return 1;
    if (!b.nextReviewAt) return -1;
    return a.nextReviewAt.localeCompare(b.nextReviewAt);
  });

  return (
    <div>
      <div className="bg-slate-900/60 html-light:bg-white border border-slate-800 html-light:border-slate-200 rounded-xl p-4 sm:p-5 mb-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <RotateCw className="w-5 h-5 text-rose-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white html-light:text-slate-900 tracking-tight">
            Spaced Repetition & Revision Queue
          </h1>
        </div>
        <p className="text-xs text-slate-400 html-light:text-slate-600 mb-3">
          Overcome the forgetting curve. Questions scheduled for periodic review, marked for revision, or starred appear here automatically.
        </p>

        {/* Informative rule pills */}
        <div className="pt-3 border-t border-slate-800/80 html-light:border-slate-200 flex flex-wrap items-center gap-2 sm:gap-2.5 text-[11px]">
          <span className="font-semibold text-slate-300 html-light:text-slate-700 mr-1">
            How questions enter revision:
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 html-light:text-rose-700 border border-rose-500/20">
            <RotateCw className="w-3 h-3 text-rose-400" />
            1. Status &quot;Revise&quot;
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 html-light:text-amber-700 border border-amber-500/20">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            2. Starred / Bookmarked
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 html-light:text-indigo-700 border border-indigo-500/20">
            <Calendar className="w-3 h-3 text-indigo-400" />
            3. Spaced Review Due (+3d on Solved or custom)
          </span>
        </div>
      </div>

      <div className="bg-slate-900/40 html-light:bg-white border border-slate-800 html-light:border-slate-200 rounded-xl divide-y divide-slate-800/80 html-light:divide-slate-200">
        {revisionItems.length > 0 ? (
          revisionItems.map((prog) => {
            const prob = getProblem(prog.problemId);
            if (!prob) return null;

            return (
              <ProblemRow
                key={prog.problemId}
                problem={prob}
                progress={prog}
                onToggleSolved={onToggleSolved}
                onSetStatus={onSetStatus}
                onToggleStar={onToggleStar}
                onSaveNote={onSaveNote}
                onScheduleReview={onScheduleReview}
              />
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
            <div className="font-semibold text-slate-200">Revision Queue Clear!</div>
            <div>No problems currently due for review. Mark any problem with &quot;Revise&quot; or click &quot;Spaced Review&quot; to queue it.</div>
          </div>
        )}
      </div>
    </div>
  );
};
