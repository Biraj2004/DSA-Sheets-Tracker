import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Menu,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { sheetList } from '../data/sheets';
import { TRACKER_STATS, formatCount } from '../data/stats';

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

export const TAB_SHORT_NAMES: Record<string, string> = {
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const currentSheetName =
    activeSheetId === 'all'
      ? 'All Problems'
      : activeSheetId === 'revision'
      ? 'Revision'
      : TAB_SHORT_NAMES[activeSheetId] ||
        sheetList.find((s) => s.id === activeSheetId)?.name ||
        'Sheets';

  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 dark:bg-slate-950/95 html-light:bg-white/95 backdrop-blur-md border-b border-slate-800 html-light:border-slate-200 text-slate-100 html-light:text-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 group cursor-pointer shrink-0"
              title="Go to Sheets Tracker Dashboard"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden ring-1 ring-slate-700/80 html-light:ring-slate-300 group-hover:ring-indigo-500/60 transition-all shadow-xs shrink-0">
                <img src="/favicon.svg" alt="DSA Tracker Logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold text-sm sm:text-base tracking-tight text-white html-light:text-slate-900 group-hover:text-indigo-200 html-light:group-hover:text-indigo-600 transition-colors">
                    DSA Tracker
                  </span>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    v2.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                  Curated sheets with unified progress synchronization
                </p>
              </div>
            </Link>

            {/* Mobile Active Sheet Indicator Pill */}
            <button
              id="mobile-sheet-pill-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              className="sm:hidden inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/15 text-indigo-300 html-light:bg-indigo-50 html-light:text-indigo-700 border border-indigo-500/30 truncate max-w-30"
              title="Open sheet selector menu"
              aria-label={`Current sheet: ${currentSheetName}. Tap to change sheet.`}
            >
              <span className="truncate">{currentSheetName}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-70 shrink-0" />
            </button>
          </div>

          {/* Desktop & Mobile Navigation Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Global Master Progress (Desktop only) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 html-light:bg-slate-100 border border-slate-800 html-light:border-slate-200 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 html-light:text-slate-600">Total Solved:</span>
              <span className="font-semibold text-white html-light:text-slate-900 font-mono-num">
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
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isHomePage && activeSheetId === 'revision'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-900 html-light:bg-slate-100 text-rose-400 border-slate-800 html-light:border-slate-200 hover:bg-slate-800 html-light:hover:bg-slate-200'
                }`}
                title="Problems due for spaced repetition review"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Revise</span>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold font-mono-num">
                  {revisionDueCount}
                </span>
              </button>
            )}

            {/* Contact / Developer Details Button (Desktop only) */}
            <Link
              to="/contact"
              className={`hidden sm:inline-flex p-2 rounded-lg border transition-colors cursor-pointer ${
                isContactPage
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                  : 'bg-slate-900 hover:bg-slate-800 html-light:bg-slate-100 html-light:hover:bg-slate-200 border-slate-800 html-light:border-slate-200 text-slate-300 html-light:text-slate-700 hover:text-white html-light:hover:text-slate-900'
              }`}
              title="About Developer, Repo & Contact"
              aria-label="About Developer, Repo and Contact"
            >
              <Mail className="w-4 h-4 text-indigo-400" />
            </Link>

            {/* GitHub Repository Link (Desktop only) */}
            <a
              href="https://github.com/Biraj2004/DSA-Sheets-Tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex p-2 rounded-lg bg-slate-900 hover:bg-slate-800 html-light:bg-slate-100 html-light:hover:bg-slate-200 border border-slate-800 html-light:border-slate-200 text-slate-300 html-light:text-slate-700 hover:text-white html-light:hover:text-slate-900 transition-colors cursor-pointer"
              title="GitHub Repository (Biraj2004/DSA-Sheets-Tracker)"
              aria-label="GitHub Repository"
            >
              <svg className="w-4 h-4 fill-current text-slate-400 hover:text-white html-light:text-slate-600 html-light:hover:text-slate-900" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* Keyboard Shortcuts Help (Desktop only) */}
            {onOpenShortcuts && (
              <button
                onClick={onOpenShortcuts}
                className="hidden sm:inline-flex p-2 rounded-lg bg-slate-900 hover:bg-slate-800 html-light:bg-slate-100 html-light:hover:bg-slate-200 border border-slate-800 html-light:border-slate-200 text-slate-300 hover:text-white html-light:text-slate-700 html-light:hover:text-slate-900 transition-colors cursor-pointer"
                title="Keyboard Shortcuts (?)"
                aria-label="Keyboard shortcuts"
              >
                <Keyboard className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {/* Data Management / Backup (Desktop only) */}
            {onOpenDataManagement && (
              <button
                onClick={onOpenDataManagement}
                className="hidden sm:inline-flex p-2 rounded-lg bg-slate-900 hover:bg-slate-800 html-light:bg-slate-100 html-light:hover:bg-slate-200 border border-slate-800 html-light:border-slate-200 text-slate-300 hover:text-white html-light:text-slate-700 html-light:hover:text-slate-900 transition-colors cursor-pointer"
                title="Data Management & Backup"
                aria-label="Data management and backup"
              >
                <Database className="w-4 h-4 text-indigo-400" />
              </button>
            )}

            {/* Theme Toggle (Always visible) */}
            <button
              id="mobile-theme-toggle-btn"
              onClick={onToggleTheme}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-900 hover:bg-slate-800 html-light:bg-slate-100 html-light:hover:bg-slate-200 border border-slate-800 html-light:border-slate-200 text-slate-300 hover:text-white html-light:text-slate-700 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              id="mobile-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 html-light:bg-slate-100 html-light:hover:bg-slate-200 border border-slate-800 html-light:border-slate-200 text-slate-200 html-light:text-slate-800 transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open sheets menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Sheet Tabs Navigation Row (Hidden on mobile) */}
        <nav
          className="hidden sm:flex flex-wrap items-center gap-1.5 py-2 text-xs border-t border-slate-800/60 html-light:border-slate-200"
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
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                    : 'bg-slate-900/60 hover:bg-slate-800 html-light:bg-white html-light:hover:bg-slate-100 text-slate-300 hover:text-white html-light:text-slate-700 html-light:hover:text-slate-900 border-slate-800/80 html-light:border-slate-200'
                }`}
              >
                <span>{displayName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono-num ${
                    isActive
                      ? 'bg-indigo-950/60 text-indigo-200'
                      : 'bg-slate-800 html-light:bg-slate-100 text-slate-400 html-light:text-slate-600'
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
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                : 'bg-slate-900/60 hover:bg-slate-800 html-light:bg-white html-light:hover:bg-slate-100 text-slate-300 hover:text-white html-light:text-slate-700 html-light:hover:text-slate-900 border-slate-800/80 html-light:border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Problems</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono-num ${
                isHomePage && activeSheetId === 'all'
                  ? 'bg-indigo-950/60 text-indigo-200'
                  : 'bg-slate-800 html-light:bg-slate-100 text-slate-400 html-light:text-slate-600'
              }`}
            >
              {totalProblemsCount}
            </span>
          </button>
        </nav>
      </div>

      {/* ── Slide-Over Mobile Drawer (Portaled to document.body) ── */}
      {isMobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="sm:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/80 html-light:bg-slate-900/50 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div
              className="relative ml-auto w-full max-w-[320px] h-full min-h-screen bg-slate-950 html-light:bg-white border-l border-slate-800 html-light:border-slate-200 shadow-2xl flex flex-col z-10 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800 html-light:border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-slate-700/80 html-light:ring-slate-300 shrink-0">
                    <img src="/favicon.svg" alt="DSA Tracker Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white html-light:text-slate-900">DSA Tracker</div>
                    <div className="text-[10px] text-slate-400 html-light:text-slate-500">Interview Sheets Navigator</div>
                  </div>
                </div>
                <button
                  id="mobile-drawer-close-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white html-light:text-slate-600 html-light:hover:text-slate-900 hover:bg-slate-900 html-light:hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Total Solved Overview Banner */}
              <div className="p-3 mx-4 mt-3 rounded-xl bg-slate-900/80 html-light:bg-slate-50 border border-slate-800 html-light:border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 html-light:text-slate-700 font-medium">Master Progress</span>
                </div>
                <span className="font-semibold text-emerald-400 html-light:text-emerald-600 font-mono-num text-[11px]">
                  {globalSolvedCount} / {totalProblemsCount} ({globalPercent}%)
                </span>
              </div>

              {/* Drawer Navigation Body */}
              <div className="p-4 flex-1 space-y-4">
                {/* Interview Sheets Section */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 html-light:text-slate-500 mb-2 px-1">
                    Interview Sheets
                  </div>
                  <div className="space-y-1.5">
                    {sheetList.map((sheet) => {
                      const stats = getSheetStats(sheet.id);
                      const isActive = isHomePage && activeSheetId === sheet.id;
                      const displayName = TAB_SHORT_NAMES[sheet.id] || sheet.name;
                      const percent = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;

                      return (
                        <button
                          key={sheet.id}
                          onClick={() => {
                            handleTabClick(sheet.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex flex-col p-2.5 rounded-xl border text-xs transition-all text-left cursor-pointer ${
                            isActive
                              ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-xs'
                              : 'bg-slate-900/50 hover:bg-slate-900 html-light:bg-slate-50 html-light:hover:bg-slate-100 text-slate-200 html-light:text-slate-800 border-slate-800/80 html-light:border-slate-200'
                          }`}
                        >
                          <div className="w-full flex items-center justify-between">
                            <div className="min-w-0 flex-1 mr-2">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate font-semibold text-xs sm:text-sm">{displayName}</span>
                                {isActive && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                                )}
                              </div>
                              <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-400 html-light:text-slate-500'}`}>
                                by {sheet.creator}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span
                                className={`text-[10px] font-mono-num font-semibold px-1.5 py-0.5 rounded-full ${
                                  isActive
                                    ? 'bg-indigo-950/60 text-indigo-100'
                                    : 'bg-slate-800 html-light:bg-slate-200 text-slate-300 html-light:text-slate-700'
                                }`}
                              >
                                {stats.solved}/{stats.total}
                              </span>
                              <div className={`text-[9px] font-mono-num text-right mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-400 html-light:text-slate-500'}`}>
                                {percent}%
                              </div>
                            </div>
                          </div>

                          {/* Slim progress bar inside drawer item */}
                          <div className="w-full h-1 rounded-full bg-slate-800/90 html-light:bg-slate-200/90 overflow-hidden mt-2">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isActive ? 'bg-white' : percent === 100 ? 'bg-emerald-400' : 'bg-indigo-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Master Catalog & Revision Views */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 html-light:text-slate-500 mb-2 px-1">
                    Global Catalogs & Queues
                  </div>
                  <div className="space-y-1.5">
                    {/* Master Catalog */}
                    <button
                      onClick={() => {
                        handleTabClick('all');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all text-left cursor-pointer ${
                        isHomePage && activeSheetId === 'all'
                          ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-xs'
                          : 'bg-slate-900/50 hover:bg-slate-900 html-light:bg-slate-50 html-light:hover:bg-slate-100 text-slate-200 html-light:text-slate-800 border-slate-800/80 html-light:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${isHomePage && activeSheetId === 'all' ? 'bg-indigo-700 text-white' : 'bg-slate-800 html-light:bg-slate-200 text-indigo-400'}`}>
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs sm:text-sm">Master Catalog</div>
                          <div className={`text-[10px] ${isHomePage && activeSheetId === 'all' ? 'text-indigo-200' : 'text-slate-400 html-light:text-slate-500'}`}>
                            {formatCount(TRACKER_STATS.totalProblems)} problems grouped by topic
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono-num font-semibold px-2 py-0.5 rounded-full ${
                          isHomePage && activeSheetId === 'all'
                            ? 'bg-indigo-950/60 text-indigo-200'
                            : 'bg-slate-800 html-light:bg-slate-200 text-slate-300 html-light:text-slate-700'
                        }`}
                      >
                        {totalProblemsCount}
                      </span>
                    </button>

                    {/* Revision View */}
                    <button
                      onClick={() => {
                        handleTabClick('revision');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all text-left cursor-pointer ${
                        isHomePage && activeSheetId === 'revision'
                          ? 'bg-rose-600 text-white border-rose-500 font-semibold shadow-xs'
                          : 'bg-slate-900/50 hover:bg-slate-900 html-light:bg-slate-50 html-light:hover:bg-slate-100 text-slate-200 html-light:text-slate-800 border-slate-800/80 html-light:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${isHomePage && activeSheetId === 'revision' ? 'bg-rose-700 text-white' : 'bg-slate-800 html-light:bg-slate-200 text-rose-400'}`}>
                          <RotateCw className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs sm:text-sm">Revision Queue</div>
                          <div className={`text-[10px] ${isHomePage && activeSheetId === 'revision' ? 'text-rose-200' : 'text-slate-400 html-light:text-slate-500'}`}>
                            Spaced review & starred
                          </div>
                        </div>
                      </div>
                      {revisionDueCount > 0 ? (
                        <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-xs">
                          {revisionDueCount} due
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 html-light:text-slate-500 px-2 py-0.5 rounded-full bg-slate-800 html-light:bg-slate-200">
                          Clear
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Tools & Links */}
                <div className="pt-2 border-t border-slate-800 html-light:border-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 html-light:text-slate-500 mb-2 px-1">
                    Tools & Info
                  </div>
                  <div className="space-y-1 text-xs">
                    {onOpenDataManagement && (
                      <button
                        onClick={() => {
                          onOpenDataManagement();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full min-h-11 flex items-center gap-2.5 p-2 rounded-lg text-slate-300 hover:text-white html-light:text-slate-700 html-light:hover:text-slate-900 hover:bg-slate-900/60 html-light:hover:bg-slate-100 transition-colors text-left cursor-pointer"
                      >
                        <Database className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>Backup & Restore (JSON)</span>
                      </button>
                    )}

                    {onOpenShortcuts && (
                      <button
                        onClick={() => {
                          onOpenShortcuts();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full min-h-11 flex items-center gap-2.5 p-2 rounded-lg text-slate-300 hover:text-white html-light:text-slate-700 html-light:hover:text-slate-900 hover:bg-slate-900/60 html-light:hover:bg-slate-100 transition-colors text-left cursor-pointer"
                      >
                        <Keyboard className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Keyboard Shortcuts Reference</span>
                      </button>
                    )}

                    <Link
                      to="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full min-h-11 flex items-center gap-2.5 p-2 rounded-lg text-slate-300 hover:text-white html-light:text-slate-700 html-light:hover:text-slate-900 hover:bg-slate-900/60 html-light:hover:bg-slate-100 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>About Developer & Contact</span>
                    </Link>

                    <a
                      href="https://github.com/Biraj2004/DSA-Sheets-Tracker"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-11 flex items-center gap-2.5 p-2 rounded-lg text-slate-300 hover:text-white html-light:text-slate-700 html-light:hover:text-slate-900 hover:bg-slate-900/60 html-light:hover:bg-slate-100 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>GitHub Repository</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Bar with Theme Switch */}
              <div className="p-3 border-t border-slate-800 html-light:border-slate-200 bg-slate-900/60 html-light:bg-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-400 html-light:text-slate-600">Appearance</span>
                <button
                  onClick={onToggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 html-light:bg-white html-light:border html-light:border-slate-200 html-light:hover:bg-slate-100 text-xs text-slate-200 html-light:text-slate-800 transition-colors cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-slate-600" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};
