import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { scrollToTopFastSmooth } from './lib/scrollToTop';
import { SHEET_SHORTCUTS } from './lib/shortcuts';

export function App() {
  const {
    progressMap,
    loading,
    storageError,
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

  // Scroll to the top fast smooth whenever going or redirecting to /contact page
  useEffect(() => {
    if (location.pathname === '/contact') {
      scrollToTopFastSmooth();
    }
  }, [location.pathname, location.key]);

  // Modal dialog states
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [characterShortcuts, setCharacterShortcuts] = useState(() => {
    try {
      return localStorage.getItem('dsa_character_shortcuts') !== 'off';
    } catch {
      return true;
    }
  });

  const changeCharacterShortcuts = (enabled: boolean) => {
    setCharacterShortcuts(enabled);
    try {
      localStorage.setItem('dsa_character_shortcuts', enabled ? 'on' : 'off');
    } catch {
      // The preference still applies to the current session.
    }
  };

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

  const handleSelectSheet = useCallback((id: string) => {
    setActiveSheetId(id);
    if (location.pathname !== '/') {
      navigate(`/?sheet=${id}`);
    } else {
      setSearchParams({ sheet: id });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, navigate, setSearchParams]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        e.defaultPrevented || e.isComposing || e.repeat ||
        (target instanceof HTMLElement &&
          (target.isContentEditable || target.closest('input, textarea, select')))
      ) {
        return;
      }

      const search = () => document.querySelector<HTMLInputElement>('input[aria-label="Search problems by name or topic"]');
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && key === 'k') {
        if (isDataModalOpen || isShortcutsOpen) return;
        const input = search();
        if (input) {
          e.preventDefault();
          input.focus();
        }
        return;
      }

      if (!characterShortcuts || e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        if (isDataModalOpen) return;
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      if (isDataModalOpen || isShortcutsOpen) return;

      const sheetId = SHEET_SHORTCUTS.get(key);
      if (key === '/') {
        const input = search();
        if (input) {
          e.preventDefault();
          input.focus();
        }
      } else if (sheetId) {
        handleSelectSheet(sheetId);
      } else if (key === 'a') {
        handleSelectSheet('all');
      } else if (key === 'r') {
        handleSelectSheet('revision');
      } else if (key === 't') {
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [characterShortcuts, handleSelectSheet, isDataModalOpen, isShortcutsOpen]);

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
        characterShortcuts={characterShortcuts}
        onCharacterShortcutsChange={changeCharacterShortcuts}
      />

      {storageError && (
        <div role="alert" className="fixed bottom-4 left-4 right-4 z-40 rounded-lg border border-rose-500 bg-slate-900 p-3 text-sm text-rose-300 sm:right-auto html-light:bg-white html-light:text-rose-900">
          {storageError}
        </div>
      )}

      {/* Floating Circular Scroll to Top Action Button */}
      <ScrollToTop />
    </div>
  );
}

export default App;
