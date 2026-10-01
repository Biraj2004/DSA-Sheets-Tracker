import {
  Layers,
  Sun,
  Moon,
  CheckCircle2,
  RotateCw,
  Database,
  Keyboard,
} from 'lucide-react';
import { sheetList } from '../data/sheets';

interface HeaderProps {
  activeSheetId: string;
  onSelectSheet: (id: string) => void;
  getSheetStats: (id: string) => { total: number; solved: number; percentage: number };
  globalSolvedCount: number;
  totalProblemsCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  revisionDueCount: number;
  onOpenDataManagement?: () => void;
  onOpenShortcuts?: () => void;
}

const TAB_SHORT_NAMES: Record<string, string> = {
  'striver-a2z': 'Striver A2Z',
  'neetcode-250': 'NeetCode 250',
  'namaste-dsa': 'Namaste DSA',
  'fraz-interview': "Fraz's Sheet",
  'pattern-wise': 'Pattern-Wise',
  'love-babbar-450': 'Babbar 450',
  'apna-college': 'Apna College',
};

export const Header: React.FC<HeaderProps> = ({
  activeSheetId,
  onSelectSheet,
  getSheetStats,
  globalSolvedCount,
  totalProblemsCount,
  theme,
  onToggleTheme,
  revisionDueCount,
  onOpenDataManagement,
  onOpenShortcuts,
}) => {
  const globalPercent = Math.round((globalSolvedCount / totalProblemsCount) * 100);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 p-1 flex items-center justify-center shadow-sm">
              <img src="/favicon.svg" alt="DSA Tracker" className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  DSA Tracker
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Curated sheets with unified progress synchronization
              </p>
            </div>
          </div>

          {/* Global Progress Pill & Theme Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Global Master Progress */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Total Solved:</span>
              <span className="font-semibold text-white font-mono-num">
                {globalSolvedCount} / {totalProblemsCount}
              </span>
              <span className="text-emerald-400 font-medium font-mono-num">
                ({globalPercent}%)
              </span>
            </div>

            {/* Revision Due Badge */}
            {revisionDueCount > 0 && (
              <button
                onClick={() => onSelectSheet('revision')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  activeSheetId === 'revision'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-900 text-rose-400 border-slate-800 hover:bg-slate-800'
                }`}
                title="Problems due for spaced repetition review"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Revise</span>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold font-mono-num">
                  {revisionDueCount}
                </span>
              </button>
            )}

            {/* Keyboard Shortcuts Help */}
            {onOpenShortcuts && (
              <button
                onClick={onOpenShortcuts}
                className="hidden sm:inline-flex p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Keyboard Shortcuts (?)"
                aria-label="Keyboard shortcuts"
              >
                <Keyboard className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {/* Data Management / Backup */}
            {onOpenDataManagement && (
              <button
                onClick={onOpenDataManagement}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Data Management & Backup"
                aria-label="Data management and backup"
              >
                <Database className="w-4 h-4 text-indigo-400" />
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Sheet Tabs Navigation Row */}
        <nav
          className="flex flex-wrap items-center gap-1.5 py-2 text-xs border-t border-slate-800/60"
          aria-label="DSA Sheets"
        >
          {sheetList.map((sheet) => {
            const stats = getSheetStats(sheet.id);
            const isActive = activeSheetId === sheet.id;
            const displayName = TAB_SHORT_NAMES[sheet.id] || sheet.name;

            return (
              <button
                key={sheet.id}
                onClick={() => onSelectSheet(sheet.id)}
                title={sheet.name}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800/80'
                }`}
              >
                <span>{displayName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono-num ${
                    isActive
                      ? 'bg-indigo-950/60 text-indigo-200'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {stats.solved}/{stats.total}
                </span>
              </button>
            );
          })}

          {/* Master All Problems Tab */}
          <button
            onClick={() => onSelectSheet('all')}
            title="All Problems Master Catalog"
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
              activeSheetId === 'all'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/20'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Problems</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono-num ${
                activeSheetId === 'all'
                  ? 'bg-indigo-950/60 text-indigo-200'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {totalProblemsCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
