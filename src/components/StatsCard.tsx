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
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 mb-5 space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {sheetData.sheet.name}
            </h1>
            <a
              href={sheetData.sheet.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
              title="Original author syllabus"
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Curated by <span className="text-slate-300 font-medium">{sheetData.sheet.creator}</span> • {sheetData.sections.length} authentic sections
          </p>
        </div>

        {/* Big Percentage & Completion Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="text-right">
            <div className="text-2xl font-bold font-mono-num text-white">
              {percent}%
            </div>
            <div className="text-[11px] text-slate-400 font-mono-num">
              {solved} of {total} completed
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-sm">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>
      </div>

      {/* Main Overall Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Difficulty Breakdown Badges & Quick Step Jump */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Difficulty 3-Pills */}
        <div className="grid grid-cols-3 gap-2 flex-1 text-xs">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5">
            <span className="text-emerald-400 font-semibold block text-[11px]">Easy</span>
            <span className="text-white font-mono-num font-bold text-sm">
              {easySolved} <span className="text-slate-500 text-xs font-normal">/ {easyTotal}</span>
            </span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5">
            <span className="text-amber-400 font-semibold block text-[11px]">Medium</span>
            <span className="text-white font-mono-num font-bold text-sm">
              {medSolved} <span className="text-slate-500 text-xs font-normal">/ {medTotal}</span>
            </span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5">
            <span className="text-rose-400 font-semibold block text-[11px]">Hard</span>
            <span className="text-white font-mono-num font-bold text-sm">
              {hardSolved} <span className="text-slate-500 text-xs font-normal">/ {hardTotal}</span>
            </span>
          </div>
        </div>

        {/* Quick Jump Dropdown */}
        {onJumpToSection && sheetData.sections.length > 1 && (
          <div className="sm:w-56 shrink-0">
            <div className="relative">
              <ListFilter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onJumpToSection(e.target.value);
                  }
                }}
                defaultValue=""
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="" disabled>
                  Jump to section...
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
      <div className="border-t border-slate-800/80 pt-3">
        <button
          onClick={() => setShowSynergy(!showSynergy)}
          className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white py-1 transition-colors"
        >
          <div className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cross-Sheet Synergy & Overlap</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-normal">
              Unified Sync
            </span>
          </div>
          {showSynergy ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showSynergy && (
          <div className="mt-2.5 space-y-2">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Questions solved in <strong className="text-slate-200">{sheetData.sheet.name}</strong> automatically count toward other curated sheets. See your cross-sheet completion below:
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
                    className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs flex flex-col justify-between gap-2 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-200">
                          {syn.targetSheetName}
                        </span>
                        <span className="text-[11px] text-indigo-300 font-mono-num font-medium">
                          {syn.percentageOfTarget}% covered
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Shares <strong className="text-slate-300">{syn.sharedCount}</strong> problems with this sheet.
                      </p>
                    </div>

                    {/* Progress Bar for Shared Problems */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>Solved from overlap:</span>
                        <span className="font-mono-num text-emerald-400 font-semibold">
                          {syn.solvedSharedCount} / {syn.sharedCount} ({synPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
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
