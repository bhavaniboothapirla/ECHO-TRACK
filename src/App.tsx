/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { DailyLog } from './components/DailyLog';
import { DateSelector } from './components/DateSelector';
import { EstimatesInfoModal } from './components/EstimatesInfoModal';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SettingsModal } from './components/SettingsModal';
import { Stats } from './components/Stats';
import { WeekChart } from './components/WeekChart';
import { DISCLAIMER_TEXT } from './constants/footprintModel';
import { DayEntry, UserSettings } from './types';
import { getTodayKey, isFutureDate } from './utils/date';
import { calculateDayFootprint } from './utils/footprint';
import {
  loadEntries,
  loadSettings,
  saveEntries,
  saveSettings,
} from './utils/storage';
import { calculateWeeklyStats } from './utils/streak';
import { LandingPage } from './components/landing/LandingPage';

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayKey());
  const [entries, setEntries] = useState<Record<string, DayEntry>>(() => loadEntries());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Theme resolution (system vs explicit light/dark)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const initialSettings = loadSettings();
    if (initialSettings.theme === 'dark') return true;
    if (initialSettings.theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Keep html class in sync with isDark state
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Listen to system theme changes if theme is set to 'system'
  useEffect(() => {
    if (settings.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  // Current day entry
  const currentEntry: DayEntry = useMemo(() => {
    return (
      entries[selectedDate] || {
        date: selectedDate,
        habits: [],
        note: '',
        isRestDay: false,
      }
    );
  }, [entries, selectedDate]);

  // Calculations for current selected day
  const currentCalculation = useMemo(() => {
    return calculateDayFootprint(currentEntry, settings.dailyTarget);
  }, [currentEntry, settings.dailyTarget]);

  // Weekly statistics
  const weeklyStats = useMemo(() => {
    return calculateWeeklyStats(
      entries,
      selectedDate,
      settings.dailyTarget,
      settings.restDayAllowance
    );
  }, [entries, selectedDate, settings.dailyTarget, settings.restDayAllowance]);

  // Handlers
  const handleUpdateEntry = (updated: DayEntry) => {
    const nextEntries = {
      ...entries,
      [updated.date]: {
        ...updated,
        updatedAt: Date.now(),
      },
    };
    setEntries(nextEntries);
    saveEntries(nextEntries);
  };

  const handleClearDay = () => {
    const nextEntries = { ...entries };
    delete nextEntries[selectedDate];
    setEntries(nextEntries);
    saveEntries(nextEntries);
  };

  const handleSelectDate = (dateKey: string) => {
    if (!isFutureDate(dateKey)) {
      setSelectedDate(dateKey);
    }
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const newSettings: UserSettings = {
      ...settings,
      theme: nextDark ? 'dark' : 'light',
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleImportEntries = (
    importedEntries: Record<string, DayEntry>,
    importedSettings?: UserSettings
  ) => {
    const merged = {
      ...entries,
      ...importedEntries,
    };
    setEntries(merged);
    saveEntries(merged);

    if (importedSettings) {
      handleSaveSettings(importedSettings);
      if (importedSettings.theme === 'dark') setIsDark(true);
      if (importedSettings.theme === 'light') setIsDark(false);
    }
  };

  const handleResetAllData = () => {
    const empty = {};
    setEntries(empty);
    saveEntries(empty);
  };

  if (view === 'landing') {
    return <LandingPage onLaunch={() => setView('app')} />;
  }

  return (
    <div className="min-h-screen bg-[#E8EDE4] text-[#17261E] dark:bg-[#121915] dark:text-[#E4EBE5] flex flex-col transition-colors selection:bg-[#2F6B43]/20">
      {/* Top Header */}
      <Header
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={handleToggleTheme}
        isDark={isDark}
      />

      {/* Main Single Column Container (Mobile-first, max-w about 680px centered) */}
      <main className="w-full max-w-[680px] mx-auto px-4 sm:px-6 py-5 sm:py-7 flex-1 space-y-6">
        {/* Date Selector */}
        <DateSelector
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />

        {/* Hero Summary */}
        <Hero
          calculation={currentCalculation}
          dailyTarget={settings.dailyTarget}
        />

        {/* 7-Day Trend Chart */}
        <WeekChart
          entries={entries}
          selectedDate={selectedDate}
          dailyTarget={settings.dailyTarget}
          onSelectDate={handleSelectDate}
          isDark={isDark}
        />

        {/* 3 Key Stats */}
        <Stats
          stats={weeklyStats}
          dailyTarget={settings.dailyTarget}
        />

        {/* Daily Log Options */}
        <DailyLog
          entry={currentEntry}
          onChange={handleUpdateEntry}
          onClearDay={handleClearDay}
        />

        {/* Calm Field Notebook Footer Note */}
        <footer className="pt-4 pb-10 text-center space-y-2 border-t border-[#D6DFD1] dark:border-[#24352A]">
          <p className="text-xs text-[#526859] dark:text-[#8FA596]">
            {DISCLAIMER_TEXT}
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-[#3D5244] dark:text-[#A3B8AA]">
            <button
              type="button"
              onClick={() => setView('landing')}
              className="underline hover:text-[#17261E] dark:hover:text-[#F0F5F1] transition-colors"
            >
              Landing page
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsInfoOpen(true)}
              className="underline hover:text-[#17261E] dark:hover:text-[#F0F5F1] transition-colors"
            >
              How estimates work
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="underline hover:text-[#17261E] dark:hover:text-[#F0F5F1] transition-colors"
            >
              Settings & Export
            </button>
          </div>
        </footer>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        entries={entries}
        onImportEntries={handleImportEntries}
        onResetAllData={handleResetAllData}
      />

      {/* Estimates Info Modal */}
      <EstimatesInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
}
