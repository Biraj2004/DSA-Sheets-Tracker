import { useState, useEffect, useMemo } from 'react';
import { useProgress } from './hooks/useProgress';
import {
  allProblems,
  getSheetData,
  getProblem,
} from './data/sheets';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { FilterBar, type FilterState } from './components/FilterBar';
import { SectionAccordion } from './components/SectionAccordion';
import { AllProblemsView } from './components/AllProblemsView';
import { RevisionView } from './components/RevisionView';
import { MobileNotice } from './components/MobileNotice';
import { DataManagementModal } from './components/DataManagementModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ScrollToTop } from './components/ScrollToTop';
import { SkeletonLoader } from './components/SkeletonLoader';
import { Info, ExternalLink } from 'lucide-react';

export function App() {
  const {
    progressMap,
    loading,
    toggleSolved,
    setStatus,
    toggleStar,
    saveNote,
    scheduleReview,
    markSectionSolved,
    resetSection,
    resetAllData,
    exportBackup,
    importBackup,
    globalSolvedCount,
    globalStarredCount,
    getSheetStats,
  } = useProgress();

  // Active sheet selection ('pattern-wise' default)
  const [activeSheetId, setActiveSheetId] = useState<string>('pattern-wise');

  // Modal dialog states
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Theme state ('dark' default, persisted in localStorage)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('dsa_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark'; // default set to dark mode only
  });

  // Mobile phone detection (< 640px) & bypass
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  });
  const [bypassMobile, setBypassMobile] = useState<boolean>(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('dsa_bypass_mobile') === 'true'
      : false;
  });

  // Listen to resize and orientation changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Theme class effect on documentElement
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dsa_theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleBypassMobile = () => {
    setBypassMobile(true);
    localStorage.setItem('dsa_bypass_mobile', 'true');
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (e.key === 'Escape') {
        setIsDataModalOpen(false);
        setIsShortcutsOpen(false);
        if (isInput) (activeEl as HTMLElement).blur();
        return;
      }

      if (isInput) return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
        searchInput?.focus();
      } else if (e.key === '1') {
        setActiveSheetId('striver-a2z');
      } else if (e.key === '2') {
        setActiveSheetId('love-babbar-450');
      } else if (e.key === '3') {
        setActiveSheetId('neetcode-150');
      } else if (e.key === '4') {
        setActiveSheetId('neetcode-250');
      } else if (e.key === '5') {
        setActiveSheetId('apna-college');
      } else if (e.key === 'a' || e.key === 'A') {
        setActiveSheetId('all');
      } else if (e.key === 'r' || e.key === 'R') {
        setActiveSheetId('revision');
      } else if (e.key === 't' || e.key === 'T') {
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter state (unfiltered by default!)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    difficulty: 'all',
    platform: 'all',
  });

  // Active sheet data
  const currentSheetData = useMemo(() => {
    return getSheetData(activeSheetId);
  }, [activeSheetId]);

  // Count revision due
  const revisionDueCount = useMemo(() => {
    let count = 0;
    const now = new Date().toISOString();
    progressMap.forEach((p) => {
      if (p.status === 'revise' || (p.nextReviewAt && p.nextReviewAt <= now) || p.isStarred) {
        count++;
      }
    });
    return count;
  }, [progressMap]);

  // Mobile info view gate
  if (isMobile && !bypassMobile) {
    return <MobileNotice onBypass={handleBypassMobile} />;
  }

  // Filtered sections and items for active sheet
  const filteredSectionsWithItems = useMemo(() => {
    if (!currentSheetData) return [];

    return currentSheetData.sections.map((section) => {
      const itemsInSection = currentSheetData.items.filter(
        (item) => item.sectionId === section.id
      );

      // Filter items according to search & filters
      const matchingItems = itemsInSection.filter((item) => {
        const prob = getProblem(item.problemId);
        if (!prob) return false;

        const effectiveTitle = item.titleInSheet || prob.title;

        // Search
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchTitle = effectiveTitle.toLowerCase().includes(q);
          const matchTopic = prob.topics.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchTopic) return false;
        }

        // Difficulty filter
        if (filters.difficulty !== 'all' && prob.difficulty !== filters.difficulty) {
          return false;
        }

        // Platform filter
        if (filters.platform !== 'all' && prob.platform !== filters.platform) {
          return false;
        }

        // Status filter
        const prog = progressMap.get(item.problemId);
        if (filters.status === 'starred') {
          if (!prog?.isStarred) return false;
        } else if (filters.status !== 'all') {
          const currentStatus = prog?.status || 'todo';
          if (currentStatus !== filters.status) return false;
        }

        return true;
      });

      return {
        section,
        items: matchingItems,
      };
    });
  }, [currentSheetData, filters, progressMap]);

  // Total filtered items count in active sheet
  const totalFilteredCount = useMemo(() => {
    return filteredSectionsWithItems.reduce((acc, curr) => acc + curr.items.length, 0);
  }, [filteredSectionsWithItems]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col transition-colors app-root">
      {/* Top Sticky Header with Navigation Tabs */}
      <Header
        activeSheetId={activeSheetId}
        onSelectSheet={(id) => {
          setActiveSheetId(id);
          // Scroll smoothly to top on sheet change
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        getSheetStats={getSheetStats}
        globalSolvedCount={globalSolvedCount}
        totalProblemsCount={allProblems.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        revisionDueCount={revisionDueCount}
        onOpenDataManagement={() => setIsDataModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Responsive Body Container (Tablet Portrait, Tablet Landscape & Desktop) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <SkeletonLoader />
        ) : activeSheetId === 'all' ? (
          <AllProblemsView
            problems={allProblems}
            progressMap={progressMap}
            filters={filters}
            onFilterChange={setFilters}
            onToggleSolved={toggleSolved}
            onSetStatus={setStatus}
            onToggleStar={toggleStar}
            onSaveNote={saveNote}
            onScheduleReview={scheduleReview}
          />
        ) : activeSheetId === 'revision' ? (
          <RevisionView
            progressMap={progressMap}
            onToggleSolved={toggleSolved}
            onSetStatus={setStatus}
            onToggleStar={toggleStar}
            onSaveNote={saveNote}
            onScheduleReview={scheduleReview}
          />
        ) : currentSheetData ? (
          <div>
            {/* Sheet Overview Stats Card */}
            <StatsCard
              sheetData={currentSheetData}
              progressMap={progressMap}
              onSelectSheet={(sheetId) => {
                setActiveSheetId(sheetId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onJumpToSection={(sectionId) => {
                const el = document.getElementById(sectionId);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                  // If section is currently collapsed, trigger click to open it
                  const header = el.querySelector<HTMLDivElement>('[role="button"]');
                  if (header && !el.querySelector('.divide-y')) {
                    header.click();
                  }
                }
              }}
            />

            {/* Non-destructive Search & Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              filteredCount={totalFilteredCount}
              totalCount={currentSheetData.items.length}
            />

            {/* Authentic Step-by-Step Sections */}
            <div className="space-y-3">
              {filteredSectionsWithItems.map(({ section, items }, idx) => (
                <SectionAccordion
                  key={section.id}
                  section={section}
                  items={items}
                  progressMap={progressMap}
                  currentSheetId={activeSheetId}
                  defaultOpen={Boolean(filters.search || idx < 2)}
                  onToggleSolved={toggleSolved}
                  onSetStatus={setStatus}
                  onToggleStar={toggleStar}
                  onSaveNote={saveNote}
                  onScheduleReview={scheduleReview}
                  onMarkSectionSolved={markSectionSolved}
                  onResetSection={resetSection}
                />
              ))}

              {totalFilteredCount === 0 && (
                <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 border border-slate-800 rounded-xl">
                  No problems match your current search or filters in this sheet.
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Top Row: Links & Branding */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">DSA Sheets Tracker</span>
              <span>•</span>
              <span className="text-slate-400">Deterministic, Offline-First & No Data Loss</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
              <button
                onClick={() => setIsShortcutsOpen(true)}
                className="hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Shortcuts (?)
              </button>
              <button
                onClick={() => setIsDataModalOpen(true)}
                className="hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Backup & Sync
              </button>
              <a
                href="https://github.com/Biraj2004/DSA-Sheets-Tracker/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition-colors inline-flex items-center gap-1"
              >
                <span>Report Issue</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <span className="hidden md:inline">•</span>
              <span className="text-slate-500">Striver A2Z</span>
              <span className="text-slate-500">NeetCode 150/250</span>
              <span className="text-slate-500">Love Babbar 450</span>
              <span className="text-slate-500">Apna College</span>
            </div>
          </div>

          {/* Disclaimer & Platform Links Explainer Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-left space-y-3">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-2.5 text-[11px] sm:text-xs leading-relaxed text-slate-400">
                <p>
                  <strong className="text-slate-200">Disclaimer & Ownership:</strong> All problem titles, questions, and original sheet curriculums are the intellectual property of their respective creators and platforms, including <span className="text-slate-300">takeUforward (Striver)</span>, <span className="text-slate-300">NeetCode</span>, <span className="text-slate-300">Love Babbar</span>, <span className="text-slate-300">Apna College</span>, <span className="text-slate-300">LeetCode</span>, <span className="text-slate-300">GeeksforGeeks (GFG)</span>, and <span className="text-slate-300">Code360 / Coding Ninjas</span>. This project is an independent educational tool that serves purely as an open curator and progress tracker in one unified place.
                </p>
                <p>
                  <strong className="text-slate-200">Platform Navigation & Badges:</strong> Clicking a problem title or its primary badge opens the problem on its main platform (e.g., LeetCode or GFG). Badges labeled <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/30">Also in TUF</span> or secondary platform links provide quick alternative access to takeUforward articles/problems or secondary platforms for the same challenge. Badges marked with <span className="text-indigo-300 font-medium">"Also in: [Sheet Name]"</span> show which other curated sheets include this canonical problem with real-time synchronized progress.
                </p>
                <p>
                  <strong className="text-slate-200">Found a Discrepancy or Mapping Flaw?</strong> If you notice an incorrect link, missing question, misclassified difficulty, or mapping flaw, please{' '}
                  <a
                    href="https://github.com/Biraj2004/DSA-Sheets-Tracker/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline font-medium inline-flex items-center gap-1"
                  >
                    report an issue on GitHub
                    <ExternalLink className="w-3 h-3 inline" />
                  </a>
                  . Community corrections and suggestions are actively reviewed and resolved!
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Notice */}
          <div className="text-center text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} DSA Sheets Tracker. Built for developers preparing for technical interviews.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        exportBackup={exportBackup}
        importBackup={importBackup}
        resetAllData={resetAllData}
        globalSolvedCount={globalSolvedCount}
        globalStarredCount={globalStarredCount}
        totalProblemsCount={allProblems.length}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Floating Circular Scroll to Top Action Button */}
      <ScrollToTop />
    </div>
  );
}

export default App;
