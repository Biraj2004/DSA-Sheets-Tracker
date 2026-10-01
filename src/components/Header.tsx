import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Layers,
  Sun,
  Moon,
  CheckCircle2,
  RotateCw,
  Database,
  Keyboard,
  Mail,
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
  const location = useLocation();
  const navigate = useNavigate();
  const isContactPage = location.pathname === '/contact';
  const isHomePage = location.pathname === '/';

  const globalPercent = Math.round((globalSolvedCount / totalProblemsCount) * 100);

  const handleTabClick = (sheetId: string) => {
    onSelectSheet(sheetId);
    if (!isHomePage) {
      navigate(`/?sheet=${sheetId}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 group cursor-pointer"
            title="Go to Sheets Tracker Dashboard"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 p-1 flex items-center justify-center shadow-sm group-hover:border-indigo-500/50 transition-colors">
              <img src="/favicon.svg" alt="DSA Tracker" className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-indigo-200 transition-colors">
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
          </Link>

          {/* Global Progress Pill & Navigation Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
                onClick={() => handleTabClick('revision')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isHomePage && activeSheetId === 'revision'
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

            {/* Contact / Developer Details Button */}
            <Link
              to="/contact"
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isContactPage
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="About Developer, Repo & Contact"
              aria-label="About Developer, Repo and Contact"
            >
              <Mail className="w-4 h-4 text-indigo-400" />
            </Link>

            {/* GitHub Repository Link */}
            <a
              href="https://github.com/Biraj2004/DSA-Sheets-Tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="GitHub Repository (Biraj2004/DSA-Sheets-Tracker)"
              aria-label="GitHub Repository"
            >
              <svg className="w-4 h-4 fill-current text-slate-400 hover:text-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* Keyboard Shortcuts Help */}
            {onOpenShortcuts && (
              <button
                onClick={onOpenShortcuts}
                className="hidden sm:inline-flex p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
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
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Data Management & Backup"
                aria-label="Data management and backup"
              >
                <Database className="w-4 h-4 text-indigo-400" />
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
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
            const isActive = isHomePage && activeSheetId === sheet.id;
            const displayName = TAB_SHORT_NAMES[sheet.id] || sheet.name;

            return (
              <button
                key={sheet.id}
                onClick={() => handleTabClick(sheet.id)}
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
            onClick={() => handleTabClick('all')}
            title="All Problems Master Catalog"
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
              isHomePage && activeSheetId === 'all'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/20'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Problems</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono-num ${
                isHomePage && activeSheetId === 'all'
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
