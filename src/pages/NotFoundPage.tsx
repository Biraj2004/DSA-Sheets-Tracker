import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Home,
  Mail,
  ArrowLeft,
  ExternalLink,
  Layers,
  BookOpen,
} from 'lucide-react';
import { sheetList } from '../data/sheets';
import { TRACKER_STATS, formatCount, getSheetProblemCount } from '../data/stats';
import { AppFooter } from '../components/AppFooter';
import { scrollToTopFastSmooth } from '../lib/scrollToTop';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 html-light:bg-slate-50 html-light:text-slate-900 flex flex-col justify-between selection:bg-indigo-500/30">
      {/* Top Navbar */}
      <div className="border-b border-slate-800/80 html-light:border-slate-200 bg-slate-900/60 html-light:bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Tracker</span>
          </Link>

          <Link
            to="/contact"
            onClick={() => scrollToTopFastSmooth()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 html-light:bg-slate-100 html-light:text-slate-700 html-light:border-slate-300 hover:bg-slate-700 html-light:hover:bg-slate-200 text-xs text-slate-200 border border-slate-700 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Contact & Support</span>
          </Link>
        </div>
      </div>

      {/* Main 404 Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 flex flex-col items-center justify-center text-center space-y-8">
        {/* Glowing Badge & Big 404 */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
          <div className="relative space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>404 • Page Not Found</span>
            </div>
            <div className="text-7xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-rose-400 to-amber-400 select-none">
              404
            </div>
          </div>
        </div>

        {/* Path Notice & Message */}
        <div className="space-y-3 max-w-md mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-white html-light:text-slate-900 tracking-tight">
            Lost in the Algorithm?
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The path <span className="px-2 py-0.5 rounded bg-slate-900 html-light:bg-slate-100 border border-slate-800 html-light:border-slate-300 font-mono text-xs text-rose-300 html-light:text-rose-600">{location.pathname}</span> does not exist or may have been moved.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home Dashboard</span>
          </Link>

          <Link
            to="/contact"
            onClick={() => scrollToTopFastSmooth()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4 text-indigo-400" />
            <span>Contact Developer</span>
          </Link>

          <a
            href="https://github.com/Biraj2004/DSA-Sheets-Tracker/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium border border-slate-800 transition-colors"
          >
            <span>Report Broken Link</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>

        {/* Quick Sheet Navigation Grid */}
        <div className="w-full pt-8 border-t border-slate-800/80 html-light:border-slate-200 space-y-4 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Jump Directly to Curated Sheets</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            {sheetList.map((sheet) => (
              <button
                key={sheet.id}
                onClick={() => navigate(`/?sheet=${sheet.id}`)}
                className="p-3 rounded-xl bg-slate-900/60 html-light:bg-white html-light:border-slate-200 hover:bg-slate-900 html-light:hover:bg-slate-50 border border-slate-800/80 hover:border-slate-700 html-light:hover:border-slate-300 text-left transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="font-semibold text-white html-light:text-slate-900 group-hover:text-indigo-300 html-light:group-hover:text-indigo-600 transition-colors block">
                    {sheet.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    by {sheet.creator}
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-indigo-400 font-mono flex items-center justify-between">
                  <span>{formatCount(getSheetProblemCount(sheet.id))} problems</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Open &rarr;
                  </span>
                </div>
              </button>
            ))}

            <button
              onClick={() => navigate('/?sheet=all')}
              className="p-3 rounded-xl bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-500/20 hover:border-indigo-500/40 text-left transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="font-semibold text-indigo-200 group-hover:text-white transition-colors flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  All {formatCount(TRACKER_STATS.totalProblems)} Problems
                </span>
                <span className="text-[11px] text-indigo-400/80 block">
                  Master Catalog
                </span>
              </div>
              <div className="mt-2 text-[10px] text-indigo-400 font-mono flex items-center justify-between">
                <span>Unified Library</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  Open &rarr;
                </span>
              </div>
            </button>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};
