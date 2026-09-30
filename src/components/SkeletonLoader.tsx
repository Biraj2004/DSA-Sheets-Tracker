import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-5 animate-pulse" aria-busy="true" aria-label="Loading content...">
      {/* Stats Card Skeleton */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="h-7 w-56 bg-slate-800 rounded-lg" />
            <div className="h-3.5 w-40 bg-slate-800/60 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="space-y-1 text-right">
              <div className="h-6 w-14 bg-slate-800 rounded ml-auto" />
              <div className="h-3 w-28 bg-slate-800/60 rounded" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-800/80" />
          </div>
        </div>

        {/* Progress Bar Skeleton */}
        <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden" />

        {/* Difficulty 3-Pills Skeleton */}
        <div className="grid grid-cols-3 gap-2">
          <div className="h-14 bg-slate-950/70 border border-slate-800/60 rounded-lg p-2.5" />
          <div className="h-14 bg-slate-950/70 border border-slate-800/60 rounded-lg p-2.5" />
          <div className="h-14 bg-slate-950/70 border border-slate-800/60 rounded-lg p-2.5" />
        </div>

        {/* Synergy Bar Skeleton */}
        <div className="border-t border-slate-800/60 pt-3">
          <div className="h-4 w-44 bg-slate-800 rounded" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="h-9 flex-1 bg-slate-950 border border-slate-800 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-slate-950 border border-slate-800 rounded-lg" />
          <div className="h-9 w-28 bg-slate-950 border border-slate-800 rounded-lg" />
          <div className="h-9 w-28 bg-slate-950 border border-slate-800 rounded-lg" />
        </div>
      </div>

      {/* Section Accordions Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-slate-800 rounded" />
              <div className="h-4 w-48 sm:w-72 bg-slate-800 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 h-1.5 bg-slate-800 rounded-full hidden sm:block" />
              <div className="w-12 h-5 bg-slate-800 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
