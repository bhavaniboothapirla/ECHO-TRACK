/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DayEntry, WeeklyStats } from '../types';
import { addDays, getLast7DayKeys, getTodayKey } from './date';
import { calculateDayFootprint, isDayLogged } from './footprint';

/**
 * Calculates the current consecutive logging streak.
 * If today has not been logged yet, today does not break the streak — it checks starting from yesterday.
 * If restDayAllowance is enabled, allows one unlogged gap day per 7-day period (or any explicit isRestDay).
 */
export function calculateStreak(
  entries: Record<string, DayEntry>,
  restDayAllowance: boolean = true
): number {
  const today = getTodayKey();
  let startKey = today;

  // If today isn't logged yet, streak can continue from yesterday
  if (!isDayLogged(entries[today])) {
    startKey = addDays(today, -1);
  }

  let streak = 0;
  let currentKey = startKey;
  let restDaysUsedInRollingWindow = 0;
  let daysInCurrentRollingWindow = 0;

  // Walk backwards up to 365 days
  for (let i = 0; i < 365; i++) {
    const entry = entries[currentKey];
    const logged = isDayLogged(entry);
    const explicitRest = Boolean(entry?.isRestDay);

    daysInCurrentRollingWindow++;
    if (daysInCurrentRollingWindow > 7) {
      daysInCurrentRollingWindow = 1;
      restDaysUsedInRollingWindow = 0;
    }

    if (logged || explicitRest) {
      streak++;
    } else {
      // Gap day: can we use the rest day allowance?
      if (restDayAllowance && restDaysUsedInRollingWindow < 1) {
        restDaysUsedInRollingWindow++;
        // Grace day counts as maintaining the chain without adding to count
      } else {
        // Streak ends here
        break;
      }
    }

    currentKey = addDays(currentKey, -1);
  }

  return streak;
}

/**
 * Calculates 7-day stats ending on `selectedDateKey`.
 */
export function calculateWeeklyStats(
  entries: Record<string, DayEntry>,
  selectedDateKey: string,
  dailyTarget: number,
  restDayAllowance: boolean = true
): WeeklyStats {
  const last7Keys = getLast7DayKeys(selectedDateKey);

  let totalKg = 0;
  let loggedDaysCount = 0;
  let daysUnderTarget = 0;

  for (const dateKey of last7Keys) {
    const entry = entries[dateKey];
    if (isDayLogged(entry)) {
      loggedDaysCount++;
      const calc = calculateDayFootprint(entry, dailyTarget);
      totalKg += calc.total;
      if (calc.isUnderTarget) {
        daysUnderTarget++;
      }
    }
  }

  const averageKg =
    loggedDaysCount > 0 ? Math.round((totalKg / loggedDaysCount) * 10) / 10 : 0;

  const streak = calculateStreak(entries, restDayAllowance);

  return {
    averageKg,
    streak,
    daysUnderTarget,
    loggedDaysCount,
  };
}
