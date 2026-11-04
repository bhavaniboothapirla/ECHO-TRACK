/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryId = 'gettingAround' | 'food' | 'energy';

export interface CategoryOption {
  id: string;
  label: string;
  value: number; // kg CO2e
  hint?: string;
}

export interface HabitOption {
  id: string;
  label: string;
  credit: number; // kg CO2e subtracted
  hint?: string;
}

export interface CategoryConfig {
  id: CategoryId;
  name: string;
  subtitle: string;
  options: CategoryOption[];
}

export interface DayEntry {
  date: string; // YYYY-MM-DD
  gettingAround?: string;
  food?: string;
  energy?: string;
  habits: string[];
  note?: string;
  isRestDay?: boolean;
  updatedAt?: number;
}

export interface UserSettings {
  dailyTarget: number; // default 6.0
  restDayAllowance: boolean; // default true
  theme: 'system' | 'light' | 'dark';
}

export interface DayCalculation {
  total: number;
  rawCategorySum: number;
  habitCredits: number;
  isLogged: boolean;
  isUnderTarget: boolean;
  diffFromTarget: number;
  verdict: string;
}

export interface WeekDayStat {
  date: string;
  dayLabel: string; // e.g. "Wed", "04"
  shortDate: string;
  total: number;
  isLogged: boolean;
  isUnderTarget: boolean;
  isOverTarget: boolean;
  isRestDay: boolean;
  isSelected: boolean;
}

export interface WeeklyStats {
  averageKg: number;
  streak: number;
  daysUnderTarget: number;
  loggedDaysCount: number;
}
