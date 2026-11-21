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
import { ModalOverlay } from './ModalOverlay';
import { downloadBackup } from '../lib/downloadBackup';

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
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      downloadBackup(await exportBackup());
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
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Could not restore the backup. Check the file and try again.',
      });
    } finally {
      e.target.value = '';
      setIsImporting(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
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
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <ModalOverlay titleId="data-management-title" onClose={onClose}>
      <div className="relative z-10 max-h-full w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 id="data-management-title" className="text-base font-semibold text-white">
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
            role={statusMessage.type === 'success' ? 'status' : 'alert'}
            className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 html-light:text-emerald-900'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300 html-light:text-rose-900'
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
              disabled={isImporting || isResetting}
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
              <div className="flex items-center gap-2 text-rose-300 html-light:text-rose-900 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Are you sure? This action cannot be undone!</span>
              </div>
              <p className="text-[11px] text-slate-400">
                All marked problems, notes, and revision review schedules will be permanently wiped.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleReset}
                  disabled={isImporting || isResetting}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
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
    </ModalOverlay>
  );
};
