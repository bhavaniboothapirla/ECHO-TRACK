/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Download, FileJson, Minus, Plus, RefreshCw, Trash2, Upload, X } from 'lucide-react';
import { TARGET_PRESETS } from '../constants/footprintModel';
import { DayEntry, UserSettings } from '../types';
import { getTodayKey } from '../utils/date';
import { exportDataJson, importDataJson } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
  entries: Record<string, DayEntry>;
  onImportEntries: (entries: Record<string, DayEntry>, importedSettings?: UserSettings) => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  entries,
  onImportEntries,
  onResetAllData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetVal, setTargetVal] = useState<number>(settings.dailyTarget);
  const [restAllowance, setRestAllowance] = useState<boolean>(settings.restDayAllowance);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSaveTarget = (newTarget: number) => {
    const clamped = Math.max(1, Math.min(25, Math.round(newTarget * 10) / 10));
    setTargetVal(clamped);
    onSaveSettings({
      ...settings,
      dailyTarget: clamped,
      restDayAllowance: restAllowance,
    });
  };

  const handleToggleRestAllowance = () => {
    const nextVal = !restAllowance;
    setRestAllowance(nextVal);
    onSaveSettings({
      ...settings,
      dailyTarget: targetVal,
      restDayAllowance: nextVal,
    });
  };

  const handleExport = () => {
    const jsonStr = exportDataJson(entries, {
      ...settings,
      dailyTarget: targetVal,
      restDayAllowance: restAllowance,
    });
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `echotrack-export-${getTodayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDataJson(content);
      if (res.success && res.entries) {
        onImportEntries(res.entries, res.settings);
        if (res.settings) {
          setTargetVal(res.settings.dailyTarget);
          setRestAllowance(res.settings.restDayAllowance);
        }
        setImportStatus(`Successfully imported ${res.count ?? 0} daily entries!`);
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        setImportStatus(`Import failed: ${res.error || 'Invalid file format'}`);
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loggedDaysTotal = Object.keys(entries).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        className="w-full max-w-lg bg-[#F2F6F0] dark:bg-[#18251E] rounded-3xl border border-[#D6DFD1] dark:border-[#273B2E] shadow-xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#D6DFD1] dark:border-[#273B2E]">
          <div>
            <h2
              id="settings-modal-title"
              className="font-display text-lg sm:text-xl font-bold text-[#17261E] dark:text-[#F0F5F1]"
            >
              Settings & Data
            </h2>
            <p className="text-xs text-[#526859] dark:text-[#8FA596]">
              Personal targets and local backup
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#526859] dark:text-[#8FA596] hover:bg-[#E3EDE0] dark:hover:bg-[#203126] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Target editor */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#17261E] dark:text-[#F0F5F1]">
                  Daily carbon target
                </h3>
                <p className="text-xs text-[#526859] dark:text-[#8FA596]">
                  Default benchmark is 6.0 kg CO₂e per day
                </p>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-1.5 bg-[#E3EDE0] dark:bg-[#203126] p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => handleSaveTarget(targetVal - 0.5)}
                  aria-label="Decrease target"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#17261E] dark:text-[#F0F5F1] hover:bg-[#D7E4D3] dark:hover:bg-[#273D2F]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-14 text-center font-display font-bold text-sm sm:text-base text-[#17261E] dark:text-[#F0F5F1] tabular-nums">
                  {targetVal.toFixed(1)}
                </span>
                <button
                  type="button"
                  onClick={() => handleSaveTarget(targetVal + 0.5)}
                  aria-label="Increase target"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#17261E] dark:text-[#F0F5F1] hover:bg-[#D7E4D3] dark:hover:bg-[#273D2F]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick target presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#526859] dark:text-[#8FA596] mr-1">
                Presets:
              </span>
              {TARGET_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSaveTarget(preset)}
                  className={`px-2.5 py-1 text-xs rounded-xl font-mono tabular-nums transition-colors ${
                    targetVal === preset
                      ? 'bg-[#2F6B43] text-white dark:bg-[#3FA066] dark:text-[#0C150F] font-semibold'
                      : 'bg-[#E3EDE0] text-[#344A3A] dark:bg-[#203126] dark:text-[#BDCEBF] hover:bg-[#D7E4D3]'
                  }`}
                >
                  {preset.toFixed(1)} kg
                </button>
              ))}
            </div>
          </section>

          {/* Rest day streak allowance */}
          <section className="pt-4 border-t border-[#DDE5D8] dark:border-[#223328] space-y-2">
            <div className="flex items-center justify-between">
              <div className="pr-4">
                <h3 className="text-sm font-semibold text-[#17261E] dark:text-[#F0F5F1]">
                  Rest-day streak allowance
                </h3>
                <p className="text-xs text-[#526859] dark:text-[#8FA596]">
                  Allows 1 missed or marked rest day per week without resetting your streak
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={restAllowance}
                onClick={handleToggleRestAllowance}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  restAllowance
                    ? 'bg-[#2F6B43] dark:bg-[#3FA066]'
                    : 'bg-[#C7D4C3] dark:bg-[#2B3E32]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white dark:bg-[#0C150F] shadow-xs transition-transform ${
                    restAllowance ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Import / Export JSON */}
          <section className="pt-4 border-t border-[#DDE5D8] dark:border-[#223328] space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-[#17261E] dark:text-[#F0F5F1]">
                Data backup & restore
              </h3>
              <p className="text-xs text-[#526859] dark:text-[#8FA596]">
                All data stays strictly on this device ({loggedDaysTotal} recorded days)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleExport}
                className="min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-[#E3EDE0] hover:bg-[#D7E4D3] dark:bg-[#203126] dark:hover:bg-[#273D2F] text-[#17261E] dark:text-[#F0F5F1] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-[#2F6B43] dark:text-[#3FA066]" />
                Export data (JSON)
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-[#E3EDE0] hover:bg-[#D7E4D3] dark:bg-[#203126] dark:hover:bg-[#273D2F] text-[#17261E] dark:text-[#F0F5F1] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4 text-[#2F6B43] dark:text-[#3FA066]" />
                Import JSON
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="sr-only"
                aria-label="Upload JSON backup"
              />
            </div>

            {importStatus && (
              <p className="text-xs font-medium text-[#204F31] dark:text-[#63CE8E] bg-[#E0EEE3] dark:bg-[#183422] p-2.5 rounded-xl">
                {importStatus}
              </p>
            )}
          </section>

          {/* Reset / Erase all data */}
          <section className="pt-4 border-t border-[#DDE5D8] dark:border-[#223328]">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-[#8C2E2E] dark:text-[#E57373] hover:underline flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset all stored data
              </button>
            ) : (
              <div className="p-3 bg-[#FBEAEA] dark:bg-[#2C1919] rounded-2xl space-y-2">
                <p className="text-xs text-[#8C2E2E] dark:text-[#E57373] font-medium">
                  Are you sure? This erases all logged history from this browser.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetAllData();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="min-h-[40px] px-3 py-1.5 text-xs font-semibold bg-[#8C2E2E] text-white rounded-xl hover:bg-[#722323] transition-colors"
                  >
                    Yes, erase all
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="min-h-[40px] px-3 py-1.5 text-xs font-medium text-[#526859] dark:text-[#8FA596] hover:bg-[#E3EDE0] dark:hover:bg-[#203126] rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-[#E8EDE4] dark:bg-[#121915] border-t border-[#D6DFD1] dark:border-[#273B2E] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-[#2F6B43] hover:bg-[#265736] text-white dark:bg-[#3FA066] dark:text-[#0C150F] text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
