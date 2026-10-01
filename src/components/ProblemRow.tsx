import React, { useState } from 'react';
import {
  Check,
  Star,
  ExternalLink,
  FileText,
  Clock,
  RotateCw,
  HelpCircle,
  ChevronDown,
  Layers,
  Save,
  Calendar,
} from 'lucide-react';
import type { Problem, Progress, Status } from '../types';
import { getOtherSheetsForProblem } from '../data/sheets';

interface ProblemRowProps {
  problem: Problem;
  titleInSheet?: string;
  currentSheetId?: string;
  progress: Progress;
  onToggleSolved: (id: string) => void;
  onSetStatus: (id: string, status: Status) => void;
  onToggleStar: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onScheduleReview: (id: string, daysAhead: number) => void;
}

type BadgeInfo = { label: string; style: string };
type SecondaryLink = { url: string; label: string; style: string; locked?: boolean };

/** Resolves a URL domain to a human-readable platform name + Tailwind style */
function resolveDomainLabel(url: string | null): BadgeInfo {
  if (!url) return { label: 'Practice', style: 'text-slate-400 bg-slate-800 border-slate-700' };
  const lower = url.toLowerCase();
  if (lower.includes('geeksforgeeks.org') || lower.includes('gfg')) {
    return { label: 'GFG',          style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  }
  if (lower.includes('leetcode.com'))      return { label: 'LeetCode',     style: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  if (lower.includes('hackerrank.com'))    return { label: 'HackerRank',   style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  if (lower.includes('hackerearth.com'))   return { label: 'HackerEarth',  style: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
  if (lower.includes('codeforces.com'))    return { label: 'Codeforces',   style: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
  if (lower.includes('spoj.com'))          return { label: 'SPOJ',         style: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
  if (lower.includes('codechef.com'))      return { label: 'CodeChef',     style: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
  if (lower.includes('atcoder.jp'))        return { label: 'AtCoder',      style: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
  if (lower.includes('interviewbit.com'))  return { label: 'InterviewBit', style: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
  if (lower.includes('naukri.com') || lower.includes('code360') || lower.includes('codingninjas.com') || lower.includes('codestudio')) {
    return { label: 'Code360', style: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
  }
  if (lower.includes('lintcode.com'))     return { label: 'LintCode',     style: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
  if (lower.includes('neetcode.io'))      return { label: 'NeetCode',     style: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
  if (lower.includes('takeuforward.org'))  return { label: 'TUF',          style: 'text-red-400 bg-red-500/10 border-red-500/30' };
  if (lower.includes('namastedev.com'))   return { label: 'NamasteDev',   style: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
  if (lower.includes('programiz.com'))     return { label: 'Programiz',     style: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
  if (lower.includes('tutorialspoint.com'))return { label: 'TutorialsPoint',style: 'text-green-400 bg-green-500/10 border-green-500/20' };
  if (lower.includes('baeldung.com'))      return { label: 'Baeldung',      style: 'text-slate-300 bg-slate-800 border-slate-700' };
  if (lower.includes('techiedelight.com')) return { label: 'TechieDelight', style: 'text-slate-300 bg-slate-800 border-slate-700' };
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').split('.')[0];
    return { label: host.charAt(0).toUpperCase() + host.slice(1), style: 'text-slate-400 bg-slate-800 border-slate-700' };
  } catch {
    return { label: 'Practice', style: 'text-slate-400 bg-slate-800 border-slate-700' };
  }
}

const NAMED_BADGES: Record<string, BadgeInfo> = {
  leetcode:      { label: 'LeetCode',     style: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  gfg:           { label: 'GFG',          style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  geeksforgeeks: { label: 'GFG',          style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  tuf:           { label: 'TUF',          style: 'text-red-400 bg-red-500/10 border-red-500/30' },
  neetcode:      { label: 'NeetCode',     style: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
  lintcode:      { label: 'LintCode',     style: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  namastedev:    { label: 'NamasteDev',   style: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  concept:       { label: 'Concept',      style: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  codingninjas:  { label: 'Code360',      style: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  code360:       { label: 'Code360',      style: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  naukri:        { label: 'Code360',      style: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  spoj:          { label: 'SPOJ',         style: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  hackerearth:   { label: 'HackerEarth',  style: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  interviewbit:  { label: 'InterviewBit', style: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  hackerrank:    { label: 'HackerRank',   style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
};

/**
 * Routing: primary = url → badge from domain.
 * If LC or GFG → show TUF as secondary pill.
 * If TUF only  → TUF primary, no secondary.
 * 'concept' platform → show Concept badge + URL-based badge.
 */
function getRoutingInfo(problem: Problem): {
  primaryUrl: string | null;
  primaryBadge: BadgeInfo | null;
  secondaryLinks: SecondaryLink[];
  extraBadge: BadgeInfo | null;   // for concept items that also have a platform URL
} {
  const { platform, url, tufUrl, altUrl, isLeetCodePremium } = problem;

  const isTufUrl = (u: string | null | undefined) => !!u && u.includes('takeuforward.org') && !u.includes('/search/');
  const tufPlusUrl = (tufUrl && !tufUrl.includes('/search/')) ? tufUrl : (isTufUrl(url) ? url : null);

  // ── LeetCode Premium with Free Alternative Available ─────────────────
  // Invert routing: make the freely solvable alternative (GFG/NeetCode/LintCode) primary
  // so users can immediately solve it without hitting a paywall, while preserving LeetCode as secondary.
  if (isLeetCodePremium && altUrl) {
    const primaryBadge = resolveDomainLabel(altUrl);
    const secondaryLinks: SecondaryLink[] = [];

    // Preserved LeetCode link as secondary with explicit Premium indication
    if (url) {
      secondaryLinks.push({
        url,
        label: 'LeetCode (Premium)',
        style: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      });
    }

    // TUF editorial link if available
    if (tufPlusUrl && tufPlusUrl !== altUrl) {
      secondaryLinks.push({
        url: tufPlusUrl,
        label: 'TUF',
        style: 'text-red-400 bg-red-500/10 border-red-500/30',
      });
    }

    return {
      primaryUrl: altUrl,
      primaryBadge,
      secondaryLinks,
      extraBadge: null,
    };
  }

  const tufSecondary: SecondaryLink | null = (tufPlusUrl && tufPlusUrl !== url) ? {
    url: tufPlusUrl,
    label: 'TUF',
    style: 'text-red-400 bg-red-500/10 border-red-500/30',
  } : null;

  const secondaryLinks: SecondaryLink[] = tufSecondary ? [tufSecondary] : [];

  if (altUrl && altUrl !== url && altUrl !== tufPlusUrl) {
    const altBadge = resolveDomainLabel(altUrl);
    secondaryLinks.push({
      url: altUrl,
      label: altBadge.label,
      style: altBadge.style,
    });
  }

  // ── LeetCode ─────────────────────────────────────────────────────────
  if (platform === 'leetcode') {
    return {
      primaryUrl: url,
      primaryBadge: NAMED_BADGES.leetcode,
      secondaryLinks,
      extraBadge: null,
    };
  }

  // ── GFG ──────────────────────────────────────────────────────────────
  if (platform === 'gfg' || (platform as string) === 'geeksforgeeks') {
    return {
      primaryUrl: url,
      primaryBadge: NAMED_BADGES.gfg,
      secondaryLinks,
      extraBadge: null,
    };
  }

  // ── TUF (platform 'tuf' or 'other' with TUF URL) ─────────────────────
  if (platform === 'tuf' || (platform === 'other' && isTufUrl(url))) {
    return {
      primaryUrl: isTufUrl(url) ? url : tufPlusUrl,
      primaryBadge: NAMED_BADGES.tuf,
      secondaryLinks: [],
      extraBadge: null,
    };
  }

  // ── Concept: show Concept badge + resolve URL domain as extra badge ────
  if (platform === 'concept') {
    const urlBadge = url ? resolveDomainLabel(url) : null;
    return {
      primaryUrl: url,
      primaryBadge: NAMED_BADGES.concept,
      secondaryLinks,
      extraBadge: urlBadge?.label !== 'Concept' ? urlBadge : null,
    };
  }

  // ── Named platforms ───────────────────────────────────────────────────
  if (platform in NAMED_BADGES) {
    return {
      primaryUrl: url,
      primaryBadge: NAMED_BADGES[platform],
      secondaryLinks,
      extraBadge: null,
    };
  }

  // ── 'other': resolve from URL domain ─────────────────────────────────
  return {
    primaryUrl: url,
    primaryBadge: resolveDomainLabel(url),
    secondaryLinks,
    extraBadge: null,
  };
}

function DifficultyPill({ diff }: { diff?: string | null }) {
  const d = diff?.toLowerCase().trim();
  if (d === 'easy')   return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Easy</span>;
  if (d === 'medium') return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>;
  if (d === 'hard')   return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Hard</span>;
  return null;
}

export const ProblemRow: React.FC<ProblemRowProps> = React.memo(({
  problem,
  titleInSheet,
  currentSheetId,
  progress,
  onToggleSolved,
  onSetStatus,
  onToggleStar,
  onSaveNote,
  onScheduleReview,
}) => {
  const [isNotesOpen, setIsNotesOpen]     = useState(false);
  const [noteDraft, setNoteDraft]         = useState(progress.note || '');
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const displayTitle = titleInSheet || problem.title;
  const otherSheets  = getOtherSheetsForProblem(problem.id, currentSheetId);
  const isSolved     = progress.status === 'solved';

  const { primaryUrl, primaryBadge, secondaryLinks, extraBadge } = getRoutingInfo(problem);

  return (
    <div
      className={`group border-b border-slate-800/80 transition-colors ${
        isSolved ? 'bg-emerald-950/10 hover:bg-emerald-950/20' : 'bg-slate-900/30 hover:bg-slate-900/60'
      }`}
    >
      {/* ── Main Row ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 sm:py-3 gap-2 sm:gap-4">

        {/* LEFT: Checkbox + Title + Badges */}
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">

          {/* Solved checkbox */}
          <button
            onClick={() => onToggleSolved(problem.id)}
            className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all shrink-0 mt-0.5 sm:mt-0 cursor-pointer ${
              isSolved
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950 text-transparent'
            }`}
            title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
            aria-label={`Toggle solved status for ${displayTitle}`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Title + badges */}
          <div className="min-w-0 flex-1">

            {/* Row 1: title link + platform badges */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={primaryUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-medium text-sm hover:underline transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                  isSolved ? 'text-slate-300 line-through decoration-slate-600' : 'text-slate-100 hover:text-indigo-300'
                }`}
              >
                <span>{displayTitle}</span>
                {primaryUrl && (
                  <ExternalLink className="w-3 h-3 text-slate-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </a>

              {/* Platform badge + extra badge + secondary pills — no emojis */}
              <div className="inline-flex items-center gap-1.5 flex-wrap">
                {primaryBadge && primaryUrl && (
                  <a
                    href={primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open on ${primaryBadge.label}`}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border cursor-pointer hover:brightness-125 transition-all ${primaryBadge.style}`}
                  >
                    {primaryBadge.label}
                  </a>
                )}
                {primaryBadge && !primaryUrl && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${primaryBadge.style}`}>
                    {primaryBadge.label}
                  </span>
                )}
                {problem.isLeetCodePremium && !problem.altUrl && (
                  <span
                    title="Requires LeetCode Premium subscription"
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30"
                  >
                    Premium
                  </span>
                )}
                {/* Extra badge for concept items (e.g. Concept + TUF) */}
                {extraBadge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${extraBadge.style}`}>
                    {extraBadge.label}
                  </span>
                )}
                {secondaryLinks.map((link, i) => {
                  const isLcPremium = link.label.includes('Premium');
                  const badgeText = isLcPremium ? link.label : `Also in ${link.label}`;
                  const badgeTooltip = isLcPremium
                    ? 'Solve on LeetCode (Requires Premium subscription)'
                    : `Also in ${link.label}`;
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={badgeTooltip}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border cursor-pointer hover:brightness-125 transition-all ${link.style}`}
                    >
                      {badgeText}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Row 2: "Also in" cross-sheet badges */}
            {otherSheets.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-500">
                  <Layers className="w-3 h-3" />
                  <span>Also in:</span>
                </span>
                {otherSheets.map((s) => (
                  <span
                    key={s.id}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-indigo-300 border border-slate-700/60"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Action buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">

          {/* Difficulty badge — always visible on the right */}
          <DifficultyPill diff={problem.difficulty} />

          {/* Status dropdown */}
          <div className="relative">
            <button
              onClick={() => setStatusMenuOpen(!statusMenuOpen)}
              className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1 transition-colors cursor-pointer ${
                progress.status === 'solved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : progress.status === 'tried'  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : progress.status === 'revise' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="capitalize">{progress.status}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {statusMenuOpen && (
              <>
                {/* Full-screen backdrop to close on outside click */}
                <div className="fixed inset-0 z-40" onClick={() => setStatusMenuOpen(false)} />
                {/* Dropdown panel */}
                <div className="absolute right-0 mt-1 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50">
                  {(['todo', 'tried', 'solved', 'revise'] as Status[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => { onSetStatus(problem.id, st); setStatusMenuOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs capitalize flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer ${
                        progress.status === st ? 'text-indigo-400 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      {st === 'solved' && <Check className="w-3 h-3 text-emerald-400" />}
                      {st === 'tried'  && <Clock className="w-3 h-3 text-amber-400" />}
                      {st === 'revise' && <RotateCw className="w-3 h-3 text-rose-400" />}
                      {st === 'todo'   && <HelpCircle className="w-3 h-3 text-slate-500" />}
                      <span>{st}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Star */}
          <button
            onClick={() => onToggleStar(problem.id)}
            className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
              progress.isStarred
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'text-slate-500 hover:text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title={progress.isStarred ? 'Unstar' : 'Star / Bookmark'}
            aria-label="Toggle star"
          >
            <Star className={`w-4 h-4 ${progress.isStarred ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Notes */}
          <button
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className={`p-1.5 rounded-md border transition-colors relative cursor-pointer ${
              isNotesOpen || progress.note
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'text-slate-500 hover:text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="Notes & spaced review"
            aria-label="Toggle notes"
          >
            <FileText className="w-4 h-4" />
            {progress.note && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </button>
        </div>
      </div>

      {/* ── Notes + Spaced Repetition Panel ──────────────────────────── */}
      {isNotesOpen && (
        <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 py-3 text-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Notes textarea */}
            <div className="flex-1">
              <label className="block text-slate-400 text-[11px] font-semibold mb-1 uppercase tracking-wider">
                Personal Notes &amp; Complexities
              </label>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Time: O(N log N), Space: O(1). Key trick: 2 pointers..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <div className="flex justify-end mt-1.5">
                <button
                  onClick={() => onSaveNote(problem.id, noteDraft)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>

            {/* Spaced repetition */}
            <div className="sm:w-64 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-3">
              <label className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Spaced Review</span>
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                {progress.nextReviewAt
                  ? `Next review: ${new Date(progress.nextReviewAt).toLocaleDateString()}`
                  : 'No schedule set'}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[{ label: '+3 Days', days: 3 }, { label: '+7 Days', days: 7 }, { label: '+14 Days', days: 14 }, { label: '+30 Days', days: 30 }].map((item) => (
                  <button
                    key={item.days}
                    onClick={() => onScheduleReview(problem.id, item.days)}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
