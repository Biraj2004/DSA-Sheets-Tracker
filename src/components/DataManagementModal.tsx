import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Upload,
  Trash2,
  Database,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
} from 'lucide-react';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportBackup: () => Promise<string>;
  importBackup: (jsonString: string) => Promise<number>;
  resetAllData: () => Promise<void>;
  globalSolvedCount: number;
  globalStarredCount: number;
  totalProblemsCount: number;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  exportBackup,
  importBackup,
  resetAllData,
  globalSolvedCount,
  globalStarredCount,
  totalProblemsCount,
}) => {
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const json = await exportBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `dsa-tracker-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage({
        type: 'success',
        text: 'Backup downloaded successfully to your local machine.',
      });
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to generate backup file.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setStatusMessage(null);
      const text = await file.text();
      const count = await importBackup(text);
      setStatusMessage({
        type: 'success',
        text: `Successfully restored ${count} progress records!`,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Invalid backup file. Ensure it is a valid DSA Tracker JSON file.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetAllData();
      setShowConfirmReset(false);
      setStatusMessage({
        type: 'success',
        text: 'All progress data has been reset.',
      });
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to reset data.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Data Management & Backup
              </h2>
              <p className="text-xs text-slate-400">
                100% offline, stored securely in your browser's IndexedDB
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

        {/* Current Database Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 block">Catalog</span>
            <span className="text-sm font-bold font-mono-num text-white">
              {totalProblemsCount}
            </span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] text-emerald-400 block">Solved</span>
            <span className="text-sm font-bold font-mono-num text-white">
              {globalSolvedCount}
            </span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] text-amber-400 block">Starred</span>
            <span className="text-sm font-bold font-mono-num text-white">
              {globalStarredCount}
            </span>
          </div>
        </div>

        {/* Notification Status Banner */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Backup & Restore Action Buttons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 block">
                Export Local Backup
              </span>
              <span className="text-[11px] text-slate-400">
                Download a complete JSON snapshot of all your solved problems, stars, and notes.
              </span>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="ml-3 shrink-0 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 block">
                Restore from Backup
              </span>
              <span className="text-[11px] text-slate-400">
                Merge records from a previously exported JSON backup file.
              </span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="ml-3 shrink-0 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isImporting ? 'Importing...' : 'Import'}</span>
            </button>
          </div>
        </div>

        {/* Danger Zone: Reset Data */}
        <div className="border-t border-slate-800/80 pt-4">
          {!showConfirmReset ? (
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400">
                <span className="text-slate-300 font-medium">Reset Progress:</span> Clear all local progress records
              </div>
              <button
                onClick={() => setShowConfirmReset(true)}
                className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
              >
                Reset Database
              </button>
            </div>
          ) : (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Are you sure? This action cannot be undone!</span>
              </div>
              <p className="text-[11px] text-slate-400">
                All marked problems, notes, and revision review schedules will be permanently wiped.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Everything</span>
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Local Storage Tech Spec Footer */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
          <HardDrive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Storage engine: IndexedDB (Dexie.js) • Zero cloud tracking</span>
        </div>
      </div>
    </div>
  );
};
