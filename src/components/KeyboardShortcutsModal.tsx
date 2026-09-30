import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      category: 'Navigation & Views',
      shortcuts: [
        { keys: ['1'], desc: "Striver's A2Z Sheet" },
        { keys: ['2'], desc: 'Love Babbar 450 Sheet' },
        { keys: ['3'], desc: 'NeetCode 150' },
        { keys: ['4'], desc: 'NeetCode 250' },
        { keys: ['5'], desc: 'Apna College Sheet' },
        { keys: ['A'], desc: 'All Problems Catalog' },
        { keys: ['R'], desc: 'Revision & Spaced Repetition' },
      ],
    },
    {
      category: 'Quick Actions & Controls',
      shortcuts: [
        { keys: ['/'], desc: 'Focus search bar' },
        { keys: ['T'], desc: 'Toggle Dark / Light theme' },
        { keys: ['?'], desc: 'Open keyboard shortcuts' },
        { keys: ['Esc'], desc: 'Close open dialogs or dismiss modals' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-slate-400">
                Speed through your DSA workflow without touching the mouse
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {shortcutGroups.map((group) => (
            <div key={group.category} className="space-y-2">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block">
                {group.category}
              </span>
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl divide-y divide-slate-800/60 overflow-hidden text-xs">
                {group.shortcuts.map((sc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 hover:bg-slate-800/30 transition-colors"
                  >
                    <span className="text-slate-300">{sc.desc}</span>
                    <div className="flex items-center gap-1">
                      {sc.keys.map((k) => (
                        <kbd
                          key={k}
                          className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono-num text-[11px] font-semibold shadow-inner"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-500 text-center pt-1 border-t border-slate-800/60">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono-num text-[10px]">Esc</kbd> anytime to dismiss
        </p>
      </div>
    </div>
  );
};
