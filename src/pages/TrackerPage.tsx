import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  getSheetData,
  getProblem,
  allProblems,
} from '../data/sheets';
import { StatsCard } from '../components/StatsCard';
import { FilterBar, type FilterState } from '../components/FilterBar';
import { SectionAccordion } from '../components/SectionAccordion';
import { AllProblemsView } from '../components/AllProblemsView';
import { RevisionView } from '../components/RevisionView';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { AppFooter } from '../components/AppFooter';
import type { Progress, Status } from '../types';

function getSavedActiveSection(sheetId: string): string | null {
  try {
    return localStorage.getItem(`dsa_active_step_${sheetId}`);
  } catch {
    return null;
  }
}

function setSavedActiveSection(sheetId: string, sectionId: string) {
  try {
    localStorage.setItem(`dsa_active_step_${sheetId}`, sectionId);
  } catch {
    // Ignore storage errors in restricted environments
  }
}

interface TrackerPageProps {
  activeSheetId: string;
  onSelectSheet: (id: string) => void;
  progressMap: Map<string, Progress>;
  loading: boolean;
  toggleSolved: (id: string) => void;
  setStatus: (id: string, status: Status) => void;
  toggleStar: (id: string) => void;
  saveNote: (id: string, note: string) => void;
  scheduleReview: (id: string, daysAhead: number) => void;
  markSectionSolved: (problemIds: string[]) => void;
  resetSection: (problemIds: string[]) => void;
  getSheetStats?: (sheetId: string) => any;
  onOpenShortcuts: () => void;
  onOpenDataModal: () => void;
}

export const TrackerPage: React.FC<TrackerPageProps> = ({
  activeSheetId,
  onSelectSheet,
  progressMap,
  loading,
  toggleSolved,
  setStatus,
  toggleStar,
  saveNote,
  scheduleReview,
  markSectionSolved,
  resetSection,
  onOpenShortcuts,
  onOpenDataModal,
}) => {
  // Filter state
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

  // Determine the active/working section for this sheet
  const activeSectionId = useMemo(() => {
    if (!currentSheetData || currentSheetData.sections.length === 0) return null;

    // 1. Explicitly saved section from user interaction
    const saved = getSavedActiveSection(activeSheetId);
    if (saved && currentSheetData.sections.some((s) => s.id === saved)) {
      return saved;
    }

    // 2. Most recently solved problem in this sheet
    let latestTime = 0;
    let latestSectionId: string | null = null;
    for (const item of currentSheetData.items) {
      const prog = progressMap.get(item.problemId);
      if (prog?.solvedAt) {
        const time = new Date(prog.solvedAt).getTime();
        if (time > latestTime) {
          latestTime = time;
          latestSectionId = item.sectionId;
        }
      }
    }
    if (latestSectionId) return latestSectionId;

    // 3. First in-progress section (partially solved)
    for (const section of currentSheetData.sections) {
      const sectionItems = currentSheetData.items.filter((i) => i.sectionId === section.id);
      const solvedCount = sectionItems.filter(
        (i) => progressMap.get(i.problemId)?.status === 'solved'
      ).length;
      if (solvedCount > 0 && solvedCount < sectionItems.length) {
        return section.id;
      }
    }

    // 4. First uncompleted section
    for (const section of currentSheetData.sections) {
      const sectionItems = currentSheetData.items.filter((i) => i.sectionId === section.id);
      const isComplete =
        sectionItems.length > 0 &&
        sectionItems.every((i) => progressMap.get(i.problemId)?.status === 'solved');
      if (!isComplete) {
        return section.id;
      }
    }

    // 5. Default to first section
    return currentSheetData.sections[0]?.id || null;
  }, [currentSheetData, activeSheetId, progressMap]);

  // Track user-selected active section per sheet to prevent cross-sheet state pollution
  const [userActiveSectionBySheet, setUserActiveSectionBySheet] = useState<Record<string, string>>({});

  const sheetUserActiveSection = userActiveSectionBySheet[activeSheetId];
  const isValidUserSection = Boolean(
    sheetUserActiveSection &&
      currentSheetData?.sections.some((s) => s.id === sheetUserActiveSection)
  );

  const currentActiveSection = isValidUserSection
    ? sheetUserActiveSection
    : activeSectionId;

  const handleActivateSection = (sectionId: string) => {
    setUserActiveSectionBySheet((prev) => ({
      ...prev,
      [activeSheetId]: sectionId,
    }));
    setSavedActiveSection(activeSheetId, sectionId);
  };

  // Auto-scroll to active section on sheet load / sheet switch
  const hasScrolledForSheetRef = useRef<string | null>(null);

  useEffect(() => {
    if (!currentActiveSection || loading) return;

    if (hasScrolledForSheetRef.current === activeSheetId) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(currentActiveSection);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        hasScrolledForSheetRef.current = activeSheetId;
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [activeSheetId, currentActiveSection, loading]);

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
    <>
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 min-w-0 max-w-full overflow-x-clip">
        {loading ? (
          <SkeletonLoader />
        ) : activeSheetId === 'all' ? (
          /* Master All Problems Catalog View */
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
          /* Spaced Repetition Revision View */
          <RevisionView
            progressMap={progressMap}
            onToggleSolved={toggleSolved}
            onSetStatus={setStatus}
            onToggleStar={toggleStar}
            onSaveNote={saveNote}
            onScheduleReview={scheduleReview}
          />
        ) : currentSheetData ? (
          /* Active Sheet Standard View */
          <div className="space-y-6">
            {/* Sheet Overview Stats Card */}
            <StatsCard
              sheetData={currentSheetData}
              progressMap={progressMap}
              onSelectSheet={onSelectSheet}
            />

            {/* Filter & Search Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              totalCount={currentSheetData.items.length}
              filteredCount={totalFilteredCount}
            />

            {/* Sections Accordion */}
            <div className="space-y-3">
              {filteredSectionsWithItems.map(({ section, items }, idx) => {
                const isActive = section.id === currentActiveSection;
                return (
                  <SectionAccordion
                    key={section.id}
                    section={section}
                    items={items}
                    currentSheetId={activeSheetId}
                    progressMap={progressMap}
                    onToggleSolved={toggleSolved}
                    onSetStatus={setStatus}
                    onToggleStar={toggleStar}
                    onSaveNote={saveNote}
                    onScheduleReview={scheduleReview}
                    onMarkSectionSolved={markSectionSolved}
                    onResetSection={resetSection}
                    defaultOpen={isActive || (!currentActiveSection && idx < 2)}
                    isActiveStep={isActive}
                    onActivate={() => handleActivateSection(section.id)}
                  />
                );
              })}

              {totalFilteredCount === 0 && (
                <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800 text-slate-400 space-y-2">
                  <p className="text-base font-semibold text-slate-200">
                    No problems match your current filters
                  </p>
                  <p className="text-xs text-slate-400">
                    Try adjusting search keywords, clearing status filters, or switching difficulty levels.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        search: '',
                        status: 'all',
                        difficulty: 'all',
                        platform: 'all',
                      })
                    }
                    className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-indigo-400 font-medium transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>

      <AppFooter onOpenShortcuts={onOpenShortcuts} onOpenDataModal={onOpenDataModal} />
    </>
  );
};
