import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useProgress } from './hooks/useProgress';
import { allProblems, sheetList } from './data/sheets';
import { Header } from './components/Header';
import { DataManagementModal } from './components/DataManagementModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ScrollToTop } from './components/ScrollToTop';
import { TrackerPage } from './pages/TrackerPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

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

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Active sheet selection ('pattern-wise' default)
  const [activeSheetId, setActiveSheetId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const sheet = urlParams.get('sheet');
      if (
        sheet &&
        (sheet === 'all' || sheet === 'revision' || sheetList.some((s) => s.id === sheet))
      ) {
        return sheet;
      }
    }
    return 'pattern-wise'; // default to pattern-wise
  });

  // Sync activeSheetId if query param changes
  useEffect(() => {
    const sheetParam = searchParams.get('sheet');
    if (
      sheetParam &&
      (sheetParam === 'all' || sheetParam === 'revision' || sheetList.some((s) => s.id === sheetParam))
    ) {
      setActiveSheetId(sheetParam);
    }
  }, [searchParams]);

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

  const handleSelectSheet = (id: string) => {
    setActiveSheetId(id);
    if (location.pathname !== '/') {
      navigate(`/?sheet=${id}`);
    } else {
      setSearchParams({ sheet: id });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
        searchInput?.focus();
      } else if (e.key === '1') {
        handleSelectSheet('pattern-wise');
      } else if (e.key === '2') {
        handleSelectSheet('striver-a2z');
      } else if (e.key === '3') {
        handleSelectSheet('love-babbar-450');
      } else if (e.key === '4') {
        handleSelectSheet('fraz-interview');
      } else if (e.key === '5') {
        handleSelectSheet('neetcode-250');
      } else if (e.key === '6') {
        handleSelectSheet('namaste-dsa');
      } else if (e.key === '7') {
        handleSelectSheet('apna-college');
      } else if (e.key === 'a' || e.key === 'A') {
        handleSelectSheet('all');
      } else if (e.key === 'r' || e.key === 'R') {
        handleSelectSheet('revision');
      } else if (e.key === 't' || e.key === 'T') {
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname]);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col transition-colors app-root">
      {/* Top Sticky Header with Navigation Tabs */}
      <Header
        activeSheetId={activeSheetId}
        onSelectSheet={handleSelectSheet}
        getSheetStats={getSheetStats}
        globalSolvedCount={globalSolvedCount}
        totalProblemsCount={allProblems.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        revisionDueCount={revisionDueCount}
        onOpenDataManagement={() => setIsDataModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Page Routing */}
      <Routes>
        <Route
          path="/"
          element={
            <TrackerPage
              activeSheetId={activeSheetId}
              onSelectSheet={handleSelectSheet}
              progressMap={progressMap}
              loading={loading}
              toggleSolved={toggleSolved}
              setStatus={setStatus}
              toggleStar={toggleStar}
              saveNote={saveNote}
              scheduleReview={scheduleReview}
              markSectionSolved={markSectionSolved}
              resetSection={resetSection}
              onOpenShortcuts={() => setIsShortcutsOpen(true)}
              onOpenDataModal={() => setIsDataModalOpen(true)}
            />
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

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
