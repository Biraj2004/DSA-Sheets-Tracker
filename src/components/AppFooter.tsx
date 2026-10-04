import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Info, Mail } from 'lucide-react';
import { TRACKER_STATS, formatCount } from '../data/stats';

interface AppFooterProps {
  /** Optional in-app actions. Hidden on pages that don't own the modals (404, contact). */
  onOpenShortcuts?: () => void;
  onOpenDataModal?: () => void;
}

const REPO_URL = 'https://github.com/Biraj2004/DSA-Sheets-Tracker';
const AUTHOR_URL = 'https://github.com/Biraj2004';

const linkCls =
  'inline-flex items-center gap-1.5 min-h-9 px-1 rounded-md text-slate-400 html-light:text-slate-600 ' +
  'hover:text-indigo-300 html-light:hover:text-indigo-600 transition-colors cursor-pointer ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50';

/**
 * Shared footer for every page. Counts come from {@link TRACKER_STATS}
 * so the tracker, contact and 404 pages can never disagree.
 */
export const AppFooter: React.FC<AppFooterProps> = ({ onOpenShortcuts, onOpenDataModal }) => (
  <footer className="mt-12 border-t border-slate-800/80 html-light:border-slate-200 bg-slate-950/80 html-light:bg-slate-50 py-8 text-xs text-slate-400 html-light:text-slate-600 app-footer">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Brand + links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="font-semibold text-sm text-slate-200 html-light:text-slate-900">DSA Sheets Tracker</p>
          <p className="text-slate-500 html-light:text-slate-500">
            {formatCount(TRACKER_STATS.totalProblems)} problems · {TRACKER_STATS.sheetCount} sheets · offline-first, zero telemetry
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1">
          <Link to="/contact" className={linkCls}>
            <Mail className="w-3.5 h-3.5 text-indigo-400 html-light:text-indigo-600" />
            <span>About &amp; Contact</span>
          </Link>
          {onOpenShortcuts && (
            <button type="button" onClick={onOpenShortcuts} className={linkCls}>
              Shortcuts
            </button>
          )}
          {onOpenDataModal && (
            <button type="button" onClick={onOpenDataModal} className={linkCls}>
              Backup &amp; Sync
            </button>
          )}
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
          <a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer" className={linkCls}>
            <span>Report issue</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </nav>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-500 html-light:text-slate-600 border-t border-slate-800/60 html-light:border-slate-200 pt-4">
        <Info className="w-3.5 h-3.5 mt-0.5 text-slate-500 shrink-0" aria-hidden="true" />
        <p>
          All problem sets and curricula are the intellectual property of their respective creators (Striver, NeetCode,
          Love Babbar, Apna College, Fraz, Akshay Saini) and host platforms. This is an independent, non-commercial
          educational tracker.{' '}
          <Link
            to="/contact"
            className="whitespace-nowrap font-medium text-indigo-400 html-light:text-indigo-600 hover:text-indigo-300 html-light:hover:text-indigo-700 underline underline-offset-2 decoration-indigo-500/40"
          >
            Full disclaimer →
          </Link>
        </p>
      </div>

      {/* Copyright */}
      <p className="text-center text-[11px] text-slate-500">
        © {new Date().getFullYear()} DSA Sheets Tracker · Developed by{' '}
        <a
          href={AUTHOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-300 html-light:text-slate-700 hover:text-indigo-400 html-light:hover:text-indigo-600 underline underline-offset-2 decoration-slate-600"
        >
          Biraj Sarkar
        </a>{' '}
        · Built with Claude
      </p>
    </div>
  </footer>
);
