/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DEFAULT_SETTINGS } from '../constants/footprintModel';
import { DayEntry, UserSettings } from '../types';
import { addDays, getTodayKey } from './date';

const STORAGE_KEY_ENTRIES = 'echotrack_entries_v1';
const STORAGE_KEY_SETTINGS = 'echotrack_settings_v1';

// In-memory fallback if localStorage is disabled or throws QuotaExceeded
let memoryEntriesCache: Record<string, DayEntry> | null = null;
let memorySettingsCache: UserSettings | null = null;

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__echotrack_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates light sample history for the last 3 days so a new user can see the 7-day chart & streak,
 * leaving today unlogged for them to try in under 60 seconds.
 */
function createInitialSampleData(): Record<string, DayEntry> {
  const today = getTodayKey();
  const day1 = addDays(today, -1);
  const day2 = addDays(today, -2);
  const day3 = addDays(today, -3);

  return {
    [day3]: {
      date: day3,
      gettingAround: 'transit', // 0.9
      food: 'vegetarian', // 2.5
      energy: 'typical', // 3.0
      habits: ['reusable_bag_bottle', 'sorted_waste'], // -0.5
      note: 'Took the metro to work',
      updatedAt: Date.now() - 86400000 * 3,
    },
    [day2]: {
      date: day2,
      gettingAround: 'wfh', // 0
      food: 'plant_based', // 1.5
      energy: 'low_use', // 1.5
      habits: ['no_plastic', 'composted_scraps', 'line_dried'], // -1.0
      note: 'Home all day, light meals',
      updatedAt: Date.now() - 86400000 * 2,
    },
    [day1]: {
      date: day1,
      gettingAround: 'walk_cycle', // 0
      food: 'some_meat_fish', // 4.5
      energy: 'typical', // 3.0
      habits: ['reusable_bag_bottle', 'short_shower'], // -0.4
      note: 'Walked to dinner with friends',
      updatedAt: Date.now() - 86400000,
    },
  };
}

export function loadEntries(): Record<string, DayEntry> {
  if (memoryEntriesCache !== null) {
    return memoryEntriesCache;
  }

  if (!isLocalStorageAvailable()) {
    memoryEntriesCache = createInitialSampleData();
    return memoryEntriesCache;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_ENTRIES);
    if (!raw) {
      const initial = createInitialSampleData();
      saveEntries(initial);
      memoryEntriesCache = initial;
      return initial;
    }
    const parsed = JSON.parse(raw);
    const result: Record<string, DayEntry> =
      typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, DayEntry>) : {};
    memoryEntriesCache = result;
    return result;
  } catch (err) {
    console.warn('EchoTrack: Failed to read from localStorage, using memory storage', err);
    const initial = createInitialSampleData();
    memoryEntriesCache = initial;
    return initial;
  }
}

export function saveEntries(entries: Record<string, DayEntry>): boolean {
  memoryEntriesCache = entries;
  if (!isLocalStorageAvailable()) return false;

  try {
    window.localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
    return true;
  } catch (err) {
    console.warn('EchoTrack: Failed to save to localStorage', err);
    return false;
  }
}

export function loadSettings(): UserSettings {
  if (memorySettingsCache !== null) {
    return memorySettingsCache;
  }

  if (!isLocalStorageAvailable()) {
    const fallback = { ...DEFAULT_SETTINGS };
    memorySettingsCache = fallback;
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      const fallback = { ...DEFAULT_SETTINGS };
      memorySettingsCache = fallback;
      return fallback;
    }
    const parsed = JSON.parse(raw);
    const result: UserSettings = {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
    memorySettingsCache = result;
    return result;
  } catch (err) {
    console.warn('EchoTrack: Failed to read settings, using default', err);
    const fallback = { ...DEFAULT_SETTINGS };
    memorySettingsCache = fallback;
    return fallback;
  }
}

export function saveSettings(settings: UserSettings): boolean {
  memorySettingsCache = settings;
  if (!isLocalStorageAvailable()) return false;

  try {
    window.localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.warn('EchoTrack: Failed to save settings to localStorage', err);
    return false;
  }
}

export interface ExportPayload {
  version: string;
  exportedAt: string;
  settings: UserSettings;
  entries: Record<string, DayEntry>;
}

export function exportDataJson(entries: Record<string, DayEntry>, settings: UserSettings): string {
  const payload: ExportPayload = {
    version: '1.1',
    exportedAt: new Date().toISOString(),
    settings,
    entries,
  };
  return JSON.stringify(payload, null, 2);
}

export function importDataJson(
  jsonStr: string
): { success: boolean; error?: string; count?: number; settings?: UserSettings; entries?: Record<string, DayEntry> } {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'File is not a valid JSON object.' };
    }

    // Support either direct entries object or wrapped payload
    let rawEntries: unknown = null;
    let importedSettings: UserSettings | undefined;

    if (data.entries && typeof data.entries === 'object') {
      rawEntries = data.entries;
      if (data.settings && typeof data.settings.dailyTarget === 'number') {
        importedSettings = {
          dailyTarget: data.settings.dailyTarget,
          restDayAllowance: Boolean(data.settings.restDayAllowance),
          theme: data.settings.theme || 'system',
        };
      }
    } else {
      rawEntries = data;
    }

    const cleanedEntries: Record<string, DayEntry> = {};
    let count = 0;

    for (const [key, value] of Object.entries(rawEntries as Record<string, unknown>)) {
      // Validate date key format YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(key) && typeof value === 'object' && value !== null) {
        const val = value as Partial<DayEntry>;
        cleanedEntries[key] = {
          date: key,
          gettingAround: typeof val.gettingAround === 'string' ? val.gettingAround : undefined,
          food: typeof val.food === 'string' ? val.food : undefined,
          energy: typeof val.energy === 'string' ? val.energy : undefined,
          habits: Array.isArray(val.habits) ? val.habits.filter((h) => typeof h === 'string') : [],
          note: typeof val.note === 'string' ? val.note : '',
          isRestDay: Boolean(val.isRestDay),
          updatedAt: typeof val.updatedAt === 'number' ? val.updatedAt : Date.now(),
        };
        count++;
      }
    }

    if (count === 0 && !importedSettings) {
      return { success: false, error: 'No valid daily records or settings found in this file.' };
    }

    return {
      success: true,
      count,
      settings: importedSettings,
      entries: cleanedEntries,
    };
  } catch {
    return { success: false, error: 'Invalid JSON format. Please upload a valid JSON file.' };
  }
}
