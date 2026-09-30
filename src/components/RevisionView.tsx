import React from 'react';
import { RotateCw, CheckCircle2 } from 'lucide-react';
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
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <RotateCw className="w-5 h-5 text-rose-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Spaced Repetition & Revision Queue
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Overcome the forgetting curve. Questions scheduled for periodic review or marked for revision automatically appear here.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
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
