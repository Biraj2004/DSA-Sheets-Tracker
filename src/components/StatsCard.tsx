import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ListFilter,
  Sparkles,
} from 'lucide-react';
import type { SheetData, Progress } from '../types';
import { getProblem } from '../data/sheets';
import { getSheetSynergy } from '../data/synergy';

interface StatsCardProps {
  sheetData: SheetData;
  progressMap: Map<string, Progress>;
  onSelectSheet?: (sheetId: string) => void;
  onJumpToSection?: (sectionId: string) => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  sheetData,
  progressMap,
  onSelectSheet,
  onJumpToSection,
}) => {
  const [showSynergy, setShowSynergy] = useState(true);

  const total = sheetData.items.length;
  let solved = 0;
  let easyTotal = 0;
  let easySolved = 0;
  let medTotal = 0;
  let medSolved = 0;
  let hardTotal = 0;
  let hardSolved = 0;

  sheetData.items.forEach((item) => {
    const prob = getProblem(item.problemId);
    const isSolved = progressMap.get(item.problemId)?.status === 'solved';
    if (isSolved) solved++;

    if (prob?.difficulty === 'easy') {
      easyTotal++;
      if (isSolved) easySolved++;
    } else if (prob?.difficulty === 'medium') {
      medTotal++;
      if (isSolved) medSolved++;
    } else if (prob?.difficulty === 'hard') {
      hardTotal++;
      if (isSolved) hardSolved++;
    }
  });

  const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
  const synergyList = getSheetSynergy(sheetData.sheet.id, progressMap);

  return (
    <div className="bg-slate-900/60 html-light:bg-white border border-slate-800 html-light:border-slate-200 rounded-xl p-3.5 sm:p-5 mb-4 sm:mb-5 space-y-3.5 sm:space-y-4 min-w-0">
      {/* Top Header Row: Balanced side-by-side on all screens */}
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-bold text-white html-light:text-slate-900 tracking-tight">
              {sheetData.sheet.name}
            </h1>
            <a
              href={sheetData.sheet.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 html-light:text-indigo-600 html-light:hover:text-indigo-700 inline-flex items-center gap-1 font-medium transition-colors"
              title="Original author syllabus"
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-slate-400 html-light:text-slate-500 mt-1 leading-relaxed">
            Curated by <span className="text-slate-200 html-light:text-slate-800 font-medium">{sheetData.sheet.creator}</span> • {sheetData.sections.length} authentic sections
          </p>
        </div>

        {/* Completion Stat with SVG Progress Ring */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 text-right">
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono-num text-white html-light:text-slate-900 tracking-tight">
              {percent}%
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 html-light:text-slate-500 font-mono-num whitespace-nowrap">
              {solved} of {total} completed
            </div>
          </div>
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r="18"
                className="stroke-slate-800 html-light:stroke-slate-200 fill-none"
                strokeWidth="3.5"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                className={`fill-none transition-all duration-500 ${
                  percent === 100
                    ? 'stroke-emerald-400'
                    : 'stroke-indigo-500'
                }`}
                strokeWidth="3.5"
                strokeDasharray={113}
                strokeDashoffset={113 - (113 * Math.min(Math.max(percent, 0), 100)) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                  percent === 100
                    ? 'text-emerald-400'
                    : 'text-slate-600 html-light:text-slate-400'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Overall Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-950 html-light:bg-slate-200 overflow-hidden border border-slate-800/80 html-light:border-slate-200">
        <div
          className="h-full bg-linear-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Difficulty Breakdown Badges & Quick Step Jump */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-0.5">
        {/* Difficulty 3-Pills */}
        <div className="grid grid-cols-3 gap-2 flex-1 text-xs">
          <div className="bg-emerald-500/5 html-light:bg-emerald-50/60 border border-emerald-500/20 html-light:border-emerald-200 rounded-xl p-2 sm:p-2.5 flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 html-light:text-emerald-700 font-semibold text-[10px] sm:text-[11px]">Easy</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="mt-1">
              <span className="text-white html-light:text-slate-900 font-mono-num font-bold text-xs sm:text-sm">
                {easySolved}
              </span>
              <span className="text-slate-500 html-light:text-slate-400 text-[10px] sm:text-xs font-mono-num"> / {easyTotal}</span>
            </div>
          </div>

          <div className="bg-amber-500/5 html-light:bg-amber-50/60 border border-amber-500/20 html-light:border-amber-200 rounded-xl p-2 sm:p-2.5 flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 html-light:text-amber-700 font-semibold text-[10px] sm:text-[11px]">Medium</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
            <div className="mt-1">
              <span className="text-white html-light:text-slate-900 font-mono-num font-bold text-xs sm:text-sm">
                {medSolved}
              </span>
              <span className="text-slate-500 html-light:text-slate-400 text-[10px] sm:text-xs font-mono-num"> / {medTotal}</span>
            </div>
          </div>

          <div className="bg-rose-500/5 html-light:bg-rose-50/60 border border-rose-500/20 html-light:border-rose-200 rounded-xl p-2 sm:p-2.5 flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-rose-400 html-light:text-rose-700 font-semibold text-[10px] sm:text-[11px]">Hard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            </div>
            <div className="mt-1">
              <span className="text-white html-light:text-slate-900 font-mono-num font-bold text-xs sm:text-sm">
                {hardSolved}
              </span>
              <span className="text-slate-500 html-light:text-slate-400 text-[10px] sm:text-xs font-mono-num"> / {hardTotal}</span>
            </div>
          </div>
        </div>        {/* Quick Jump Dropdown */}
        {onJumpToSection && sheetData.sections.length > 1 && (
          <div className="sm:w-56 shrink-0">
            <div className="relative">
              <ListFilter className="w-3.5 h-3.5 text-slate-400 html-light:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onJumpToSection(e.target.value);
                  }
                }}
                defaultValue=""
                className="w-full pl-8 pr-3 py-2 bg-slate-950 html-light:bg-white border border-slate-800 html-light:border-slate-300 rounded-lg text-xs text-slate-200 html-light:text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="" disabled>
                  Jump to section…
                </option>
                {sheetData.sections
                  .filter((sec) => sheetData.items.some((i) => i.sectionId === sec.id))
                  .map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Cross-Sheet Synergy & Overlap Card */}
      {/* ------------------------------------------------------------- */}
      <div className="border-t border-slate-800/80 html-light:border-slate-200 pt-3">
        <button
          onClick={() => setShowSynergy(!showSynergy)}
          className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white html-light:text-slate-700 html-light:hover:text-slate-900 py-1 transition-colors"
        >
          <div className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cross-Sheet Synergy & Overlap</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/10 html-light:bg-indigo-50 text-indigo-300 html-light:text-indigo-700 border border-indigo-500/20 html-light:border-indigo-200 font-normal">
              Unified Sync
            </span>
          </div>
          {showSynergy ? (
            <ChevronUp className="w-4 h-4 text-slate-400 html-light:text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 html-light:text-slate-500" />
          )}
        </button>

        {showSynergy && (
          <div className="mt-2.5 space-y-2">
            <p className="text-[11px] text-slate-400 html-light:text-slate-600 leading-relaxed">
              Questions solved in <strong className="text-slate-200 html-light:text-slate-800">{sheetData.sheet.name}</strong> automatically count toward other curated sheets. See your cross-sheet completion below:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {synergyList.map((syn) => {
                const synPercent =
                  syn.sharedCount > 0
                    ? Math.round((syn.solvedSharedCount / syn.sharedCount) * 100)
                    : 0;

                return (
                  <div
                    key={syn.targetSheetId}
                    className="bg-slate-950/80 html-light:bg-slate-50 border border-slate-800 html-light:border-slate-200 rounded-lg p-3 text-xs flex flex-col justify-between gap-2 hover:border-slate-700 html-light:hover:border-slate-300 transition-colors synergy-card"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-200 html-light:text-slate-900">
                          {syn.targetSheetName}
                        </span>
                        <span className="text-[11px] text-indigo-300 html-light:text-indigo-600 font-mono-num font-medium">
                          {syn.percentageOfTarget}% covered
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 html-light:text-slate-600 mt-0.5">
                        Shares <strong className="text-slate-300 html-light:text-slate-800">{syn.sharedCount}</strong> problems with this sheet.
                      </p>
                    </div>

                    {/* Progress Bar for Shared Problems */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 html-light:text-slate-600 mb-1">
                        <span>Solved from overlap:</span>
                        <span className="font-mono-num text-emerald-400 html-light:text-emerald-600 font-semibold">
                          {syn.solvedSharedCount} / {syn.sharedCount} ({synPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-900 html-light:bg-slate-200 overflow-hidden border border-slate-800 html-light:border-slate-300">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${synPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Jump Action */}
                    {onSelectSheet && (
                      <button
                        onClick={() => onSelectSheet(syn.targetSheetId)}
                        className="self-end inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        <span>Open {syn.targetSheetName}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
