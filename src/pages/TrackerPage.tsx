import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
import { Info, ExternalLink, Mail } from 'lucide-react';
import type { Progress, Status } from '../types';

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
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
              {filteredSectionsWithItems.map(({ section, items }, idx) => (
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
                  defaultOpen={idx < 2}
                />
              ))}

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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-12 py-8 text-xs text-slate-400 app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Footer Nav Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">DSA Sheets Tracker</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500">Offline-First · Zero Telemetry</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="hover:text-indigo-400 transition-colors font-medium flex items-center gap-1 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>About & Contact</span>
              </Link>
              <button
                onClick={onOpenShortcuts}
                className="hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Shortcuts
              </button>
              <button
                onClick={onOpenDataModal}
                className="hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Backup & Sync
              </button>
              <a
                href="https://github.com/Biraj2004/DSA-Sheets-Tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition-colors inline-flex items-center gap-1"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a
                href="https://github.com/Biraj2004/DSA-Sheets-Tracker/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition-colors inline-flex items-center gap-1"
              >
                <span>Report Issue</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Compact Disclaimer */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 border-t border-slate-800/60 pt-4">
            <Info className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <p>
              All problem sets & curricula are the intellectual property of their respective creators (Striver, NeetCode, Love Babbar, Apna College, Fraz, Akshay Saini) and host platforms. This is an independent, non-commercial educational tracker.{' '}
              <Link to="/contact" className="text-indigo-500 hover:text-indigo-400 underline">
                Full disclaimer →
              </Link>
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center text-[11px] text-slate-500">
            © {new Date().getFullYear()} DSA Sheets Tracker · Developed by{' '}
            <a
              href="https://github.com/Biraj2004"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 underline"
            >
              Biraj Sarkar
            </a>
            {' '}· Built with Claude
          </div>
        </div>
      </footer>
    </>
  );
};
