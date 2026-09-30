import React from 'react';
import { Search, X } from 'lucide-react';
import type { Status, Difficulty, Platform } from '../types';

export interface FilterState {
  search: string;
  status: 'all' | Status | 'starred';
  difficulty: 'all' | Difficulty;
  platform: 'all' | Platform;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  filteredCount,
  totalCount,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.platform !== 'all';

  const resetFilters = () => {
    onFilterChange({
      search: '',
      status: 'all',
      difficulty: 'all',
      platform: 'all',
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 sm:p-4 mb-5 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search problems by name, topic, or platform..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills & Selects */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: e.target.value as FilterState['status'],
              })
            }
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">Status: All (Unfiltered)</option>
            <option value="todo">Status: Todo</option>
            <option value="solved">Status: Solved</option>
            <option value="tried">Status: Tried</option>
            <option value="revise">Status: Revise</option>
            <option value="starred">Status: Starred</option>
          </select>

          {/* Difficulty Select */}
          <select
            value={filters.difficulty || 'all'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                difficulty: e.target.value as FilterState['difficulty'],
              })
            }
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">Difficulty: All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Platform Select */}
          <select
            value={filters.platform}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                platform: e.target.value as FilterState['platform'],
              })
            }
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">Platform: All</option>
            <option value="leetcode">LeetCode</option>
            <option value="tuf">TUF</option>
            <option value="gfg">GFG</option>
            <option value="codingninjas">Code360</option>
            <option value="spoj">SPOJ</option>
            <option value="hackerearth">HackerEarth</option>
            <option value="interviewbit">InterviewBit</option>
          </select>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Reset all filters to show complete unfiltered sheet"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear ({filteredCount}/{totalCount})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
