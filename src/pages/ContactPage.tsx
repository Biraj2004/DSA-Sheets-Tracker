import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Star,
  GitBranch,
  ShieldCheck,
  Send,
  Terminal,
  Database,
  Sparkles,
  Info,
  CheckCircle2,
  Code2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'feedback',
    message: '',
  });
  const [formSent, setFormSent] = useState(false);

  const developerEmail = 'birajsarkar67@gmail.com';
  const githubRepo = 'https://github.com/Biraj2004/DSA-Sheets-Tracker';
  const githubProfile = 'https://github.com/Biraj2004';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(developerEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `[DSA Tracker] ${formData.topic.toUpperCase()}: from ${formData.name || 'User'}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nTopic: ${formData.topic}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${developerEmail}?subject=${subject}&body=${body}`;
    setFormSent(true);
    setTimeout(() => setFormSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 html-light:bg-slate-50 html-light:text-slate-900 flex flex-col transition-colors selection:bg-indigo-500/30">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 html-light:border-slate-200 html-light:bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 html-light:text-slate-600 hover:text-white html-light:hover:text-slate-900 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Tracker</span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 html-light:bg-slate-100 html-light:hover:bg-slate-200 html-light:text-slate-700 html-light:border-slate-300 text-xs text-slate-200 border border-slate-700 transition-colors"
            >
              {/* GitHub SVG */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 transition-colors">
        {/* Page Hero */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer & Project Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            About & Contact
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            DSA Sheets Tracker is an open-source, offline-first technical interview platform built to solve the frustration of scattered roadmaps, paywalled problems, and lost progress.
          </p>
        </div>

        {/* 2-Column Grid: Developer Card + Repo Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Developer Card (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 html-light:bg-white html-light:border-slate-200 border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative">
              <div className="flex items-start gap-4">
                {/* Profile Avatar Photo */}
                <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
                  <img
                    src="/profile2.jpg"
                    alt="Biraj Sarkar"
                    className="w-full h-full object-cover rounded-[14px]"
                    onError={(e) => {
                      const t = e.currentTarget;
                      t.style.display = 'none';
                      const fallback = t.nextElementSibling as HTMLElement | null;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback initials if image fails */}
                  <div
                    className="w-full h-full bg-slate-950 rounded-[14px] items-center justify-center font-bold text-xl text-white tracking-tight hidden"
                    aria-hidden="true"
                  >
                    BS
                  </div>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white html-light:text-slate-900 truncate">
                      Biraj Sarkar
                    </h2>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active developer" />
                  </div>
                  <p className="text-xs text-indigo-400 font-medium">
                    Software Engineer & Open Source Creator
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <span>GitHub:</span>
                    <a
                      href={githubProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-white underline font-mono inline-flex items-center gap-0.5"
                    >
                      @Biraj2004
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 html-light:text-slate-700 leading-relaxed">
                Passionate about clean software engineering, algorithmic problem solving, and building resilient browser experiences. Built DSA Sheets Tracker as an open gift for the developer community preparing for technical interviews.
              </p>

              {/* Developer Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/70 html-light:bg-slate-100 border border-slate-800/80 html-light:border-slate-200">
                  <span className="text-[11px] text-slate-500 html-light:text-slate-500 block">Focus</span>
                  <span className="text-slate-200 html-light:text-slate-900 font-semibold">Web & Systems</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 html-light:bg-slate-100 border border-slate-800/80 html-light:border-slate-200">
                  <span className="text-[11px] text-slate-500 html-light:text-slate-500 block">Location</span>
                  <span className="text-slate-200 html-light:text-slate-900 font-semibold">India (IST / UTC+5:30)</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Actions */}
            <div className="pt-6 mt-6 border-t border-slate-800/80 html-light:border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${developerEmail}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-md shadow-indigo-600/20"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Email</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <span className="text-[11px] text-slate-400 font-mono">
                  {developerEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Repo & Architecture Details (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/60 html-light:bg-white html-light:border-slate-200 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-base font-bold text-white html-light:text-slate-900">
                      Repository & Open Source Spec
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Biraj2004/DSA-Sheets-Tracker
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    MIT License
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    v2.0
                  </span>
                </div>
              </div>

              {/* 4 Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs transition-colors">
                <div className="p-3 rounded-xl bg-slate-950/70 html-light:bg-slate-100 border border-slate-800/80 html-light:border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Database className="w-3.5 h-3.5" />
                    <span>Deterministic Offline-First</span>
                  </div>
                  <p className="text-[11px] text-slate-400 html-light:text-slate-600 leading-relaxed">
                    Powered by Dexie.js (IndexedDB) with zero telemetry, zero cookies, and persistent offline backups.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 html-light:bg-slate-100 border border-slate-800/80 html-light:border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-400 html-light:text-indigo-600 font-semibold">
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>Real-Time Sheet Synergy</span>
                  </div>
                  <p className="text-[11px] text-slate-400 html-light:text-slate-600 leading-relaxed">
                    1,003 unique problems mapped canonically across 7 sheets. Solving a problem syncs everywhere.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 html-light:bg-slate-100 border border-slate-800/80 html-light:border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 html-light:text-amber-600 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Zero Paywalls Guarantee</span>
                  </div>
                  <p className="text-[11px] text-slate-400 html-light:text-slate-600 leading-relaxed">
                    All 33 LeetCode Premium questions are routed to 100% free solvable alternatives (GFG, LintCode).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 html-light:bg-slate-100 border border-slate-800/80 html-light:border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 html-light:text-rose-600 font-semibold">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Spaced Repetition & Notes</span>
                  </div>
                  <p className="text-[11px] text-slate-400 html-light:text-slate-600 leading-relaxed">
                    Integrated review scheduling (1/3/7/14/30 days) and per-problem private rich markdown notes.
                  </p>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 html-light:text-slate-500 uppercase tracking-wider block">
                  Built With Modern Architecture
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {['React 19', 'TypeScript', 'Tailwind CSS v4', 'Dexie.js (IndexedDB)', 'Vitest', 'Vite', 'Cloudflare Workers & Pages'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-slate-800 html-light:bg-slate-100 text-slate-300 html-light:text-slate-700 border border-slate-700/80 html-light:border-slate-300 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* GitHub Action Links */}
            <div className="pt-4 border-t border-slate-800/80 html-light:border-slate-200 flex flex-wrap items-center gap-3">
              <a
                href={githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 html-light:bg-slate-100 html-light:hover:bg-slate-200 html-light:text-slate-700 html-light:border-slate-300 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Star Repository</span>
              </a>

              <a
                href={`${githubRepo}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 html-light:bg-slate-100 html-light:hover:bg-slate-200 html-light:text-slate-700 html-light:border-slate-300 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>Issue Tracker</span>
              </a>

              <a
                href={`${githubRepo}/pulls`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 html-light:bg-slate-100 html-light:hover:bg-slate-200 html-light:text-slate-700 html-light:border-slate-300 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pull Requests</span>
              </a>
            </div>
          </div>
        </div>

        {/* Section 3: Legal, IP & Educational Disclaimer (Crucial) */}
        <div className="bg-slate-900/60 html-light:bg-white html-light:border-slate-200 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white html-light:text-slate-900">
                Comprehensive Disclaimer & Intellectual Property Attribution
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300 html-light:text-slate-700 leading-relaxed">
                <p>
                  <strong className="text-white">Curated Content Ownership:</strong> All problem titles, problem formulations, challenges, and curriculum designs aggregated within this application belong to their respective creators, platforms, and copyright holders. This includes, without limitation:
                </p>

                <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs">
                  <li><strong className="text-slate-200">takeUforward (Striver / Raj Vikramaditya)</strong> — Striver’s A2Z DSA Sheet and algorithmic tutorials.</li>
                  <li><strong className="text-slate-200">NeetCode (Navdeep Singh)</strong> — NeetCode 150 & NeetCode 250 structured interview roadmaps.</li>
                  <li><strong className="text-slate-200">Love Babbar</strong> — 450 DSA Cracker curriculum.</li>
                  <li><strong className="text-slate-200">Fraz (Mohammad Fraz)</strong> — Curated SDE Interview Sheet.</li>
                  <li><strong className="text-slate-200">Apna College (Aman Dhattarwal & Shradha Khapra)</strong> — Alpha DSA Sheet.</li>
                  <li><strong className="text-slate-200">Akshay Saini (NamasteDev)</strong> — Namaste DSA core interview problems.</li>
                  <li><strong className="text-slate-200">Host Platforms</strong> — LeetCode, GeeksforGeeks (GFG), Code360 / Coding Ninjas, SPOJ, CSES, HackerEarth, and CodeChef.</li>
                </ul>

                <p>
                  <strong className="text-white">Independent Educational Non-Commercial Purpose:</strong> DSA Sheets Tracker is an independent open-source educational utility developed solely to assist engineering students and software developers in organizing their interview preparation. This project is <strong>neither affiliated with, endorsed by, sponsored by, nor officially connected</strong> to any of the aforementioned authors or commercial entities.
                </p>

                <p>
                  <strong className="text-white">Zero Monetization:</strong> This project contains zero paid subscriptions, zero behind-paywall content, zero advertisements, and zero revenue-generating mechanisms.
                </p>

                <p>
                  <strong className="text-white">Notice & Corrections:</strong> If you are a platform creator or copyright owner and wish to suggest link updates, problem classifications, or request content adjustments, please submit an issue on our GitHub repository or contact the developer directly at{' '}
                  <a href={`mailto:${developerEmail}`} className="text-indigo-400 hover:text-indigo-300 underline font-medium">
                    {developerEmail}
                  </a>
                  . Modifications and community corrections are actively reviewed and resolved in good faith.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Direct Interactive Message / Feedback Form */}
        <div className="bg-slate-900/60 html-light:bg-white html-light:border-slate-200 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white html-light:text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Contact Developer / Send Feedback</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 html-light:text-slate-600">
              Have a feature request, noticed a broken problem URL, or want to say hello? Send a message directly.
            </p>
          </div>

          {formSent ? (
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <div>
                <p className="font-semibold text-white">Opening your mail client...</p>
                <p className="text-xs text-emerald-400">
                  If your mail client didn't launch automatically, please email directly to{' '}
                  <span className="font-mono font-bold text-white">{developerEmail}</span>.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    Your Name <span className="text-rose-400 text-[10px]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={60}
                    pattern="[A-Za-z\s\-'.]{2,60}"
                    title="Name should only contain letters, spaces, hyphens or apostrophes (2–60 chars)"
                    placeholder="e.g. Alex Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.replace(/[^A-Za-z\s\-'.]/g, '') })}
                    autoComplete="name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 html-light:bg-slate-50 html-light:border-slate-300 html-light:text-slate-900 html-light:placeholder-slate-400 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    Your Email <span className="text-rose-400 text-[10px]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    maxLength={120}
                    pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                    title="Enter a valid email address (e.g. you@example.com)"
                    placeholder="e.g. alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
                    autoComplete="email"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 html-light:bg-slate-50 html-light:border-slate-300 html-light:text-slate-900 html-light:placeholder-slate-400 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-topic" className="text-xs font-medium text-slate-300 block">
                  Category / Topic
                </label>
                <select
                  id="contact-topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 html-light:bg-slate-50 html-light:border-slate-300 html-light:text-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
                >
                  <option value="feedback">General Feedback / Compliment</option>
                  <option value="bug">Report a Bug / Broken Link</option>
                  <option value="mapping">Problem Mapping Flaw</option>
                  <option value="feature">Feature Suggestion</option>
                  <option value="collaboration">Collaboration / Query</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="contact-message" className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    Message <span className="text-rose-400 text-[10px]">*</span>
                  </label>
                  {/* Live word counter */}
                  {(() => {
                    const wc = formData.message.trim() === '' ? 0 : formData.message.trim().split(/\s+/).length;
                    const pct = wc / 300;
                    const colour = pct >= 1 ? 'text-rose-400' : pct >= 0.85 ? 'text-amber-400' : 'text-slate-500';
                    return (
                      <span className={`text-[11px] font-mono tabular-nums transition-colors ${colour}`}>
                        {wc} / 300 words
                      </span>
                    );
                  })()}
                </div>
                <textarea
                  id="contact-message"
                  required
                  minLength={10}
                  placeholder="Share details, suggestions, or questions… (min 10 words)"
                  value={formData.message}
                  onChange={(e) => {
                    const val = e.target.value;
                    const words = val.trim() === '' ? [] : val.trim().split(/\s+/);
                    // Hard cap at 300 words — allow editing within limit
                    if (words.length <= 300) {
                      setFormData({ ...formData, message: val });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 html-light:bg-slate-50 html-light:border-slate-300 html-light:text-slate-900 html-light:placeholder-slate-400 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all resize-y min-h-30 max-h-80"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>

                <p className="text-[11px] text-slate-500 html-light:text-slate-400 text-center sm:text-right">
                  Will trigger your default email client with your message pre-filled.
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 html-light:border-slate-200 bg-slate-900/40 html-light:bg-slate-50 py-6 text-center text-xs text-slate-500 html-light:text-slate-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} DSA Sheets Tracker • Developed by{' '}
            <a
              href={githubProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-indigo-400 underline font-medium"
            >
              Biraj Sarkar (Biraj2004)
            </a>
            {' '}• Built with Claude
          </p>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <Link to="/" className="hover:text-white transition-colors">
              Tracker Home
            </Link>
            <span>•</span>
            <a
              href={`${githubRepo}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Report Issue
            </a>
            <span>•</span>
            <a
              href={githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
