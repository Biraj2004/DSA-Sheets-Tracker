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

// Shared input / select focus + border styles
const inputCls =
  'bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg ' +
  'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all';

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

  const resetFilters = () =>
    onFilterChange({ search: '', status: 'all', difficulty: 'all', platform: 'all' });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Escape regex metacharacters so the string is always safe to use in RegExp
    const safe = e.target.value.replace(/[.*+?^${}()|[\]\\]/g, ' ').trimStart();
    onFilterChange({ ...filters, search: safe });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 sm:p-4 mb-5">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">

        {/* ── Search Input ── */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearch}
            placeholder="Search problems by name or topic…"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            maxLength={120}
            className={`w-full pl-9 pr-9 py-2 ${inputCls} placeholder:text-slate-600`}
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ── Filter Selects ── */}
        <div className="flex flex-wrap items-center gap-2">

          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as FilterState['status'] })}
            className={`px-2.5 py-1.5 cursor-pointer ${inputCls}`}
          >
            <option value="all">Status: All</option>
            <option value="todo">Todo</option>
            <option value="solved">Solved ✓</option>
            <option value="tried">Tried</option>
            <option value="revise">Revise</option>
            <option value="starred">Starred ★</option>
          </select>

          <select
            value={filters.difficulty || 'all'}
            onChange={(e) => onFilterChange({ ...filters, difficulty: e.target.value as FilterState['difficulty'] })}
            className={`px-2.5 py-1.5 cursor-pointer ${inputCls}`}
          >
            <option value="all">Difficulty: All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={filters.platform}
            onChange={(e) => onFilterChange({ ...filters, platform: e.target.value as FilterState['platform'] })}
            className={`px-2.5 py-1.5 cursor-pointer ${inputCls}`}
          >
            <option value="all">Platform: All</option>
            <option value="leetcode">LeetCode</option>
            <option value="tuf">TUF</option>
            <option value="gfg">GFG</option>
            <option value="codingninjas">Code360</option>
            <option value="namastedev">NamasteDev</option>
            <option value="spoj">SPOJ</option>
            <option value="hackerearth">HackerEarth</option>
            <option value="interviewbit">InterviewBit</option>
          </select>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Reset all filters"
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
