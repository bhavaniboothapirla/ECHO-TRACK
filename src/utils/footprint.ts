/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CATEGORIES, HABITS } from '../constants/footprintModel';
import { DayCalculation, DayEntry } from '../types';

const categoryOptionMap = new Map<string, number>();
CATEGORIES.forEach((cat) => {
  cat.options.forEach((opt) => {
    categoryOptionMap.set(`${cat.id}:${opt.id}`, opt.value);
  });
});

const habitCreditMap = new Map<string, number>();
HABITS.forEach((h) => {
  habitCreditMap.set(h.id, h.credit);
});

export function isDayLogged(entry?: Partial<DayEntry> | null): boolean {
  if (!entry) return false;
  if (entry.isRestDay) return true;
  if (entry.gettingAround || entry.food || entry.energy) return true;
  if (entry.habits && entry.habits.length > 0) return true;
  return false;
}

export function calculateDayFootprint(
  entry: Partial<DayEntry> | null | undefined,
  dailyTarget: number = 6.0
): DayCalculation {
  if (!entry || !isDayLogged(entry)) {
    return {
      total: 0,
      rawCategorySum: 0,
      habitCredits: 0,
      isLogged: false,
      isUnderTarget: true,
      diffFromTarget: dailyTarget,
      verdict: 'Nothing logged yet. Pick what applies below to see your footprint.',
    };
  }

  if (entry.isRestDay) {
    return {
      total: 0,
      rawCategorySum: 0,
      habitCredits: 0,
      isLogged: true,
      isUnderTarget: true,
      diffFromTarget: dailyTarget,
      verdict: 'Rest day recorded. Your streak stays safe. Take it easy!',
    };
  }

  let rawCategorySum = 0;
  if (entry.gettingAround) {
    rawCategorySum += categoryOptionMap.get(`gettingAround:${entry.gettingAround}`) ?? 0;
  }
  if (entry.food) {
    rawCategorySum += categoryOptionMap.get(`food:${entry.food}`) ?? 0;
  }
  if (entry.energy) {
    rawCategorySum += categoryOptionMap.get(`energy:${entry.energy}`) ?? 0;
  }

  let habitCredits = 0;
  if (entry.habits && entry.habits.length > 0) {
    for (const hId of entry.habits) {
      habitCredits += habitCreditMap.get(hId) ?? 0;
    }
  }

  // Daily total = sum of categories minus habit credits, never below zero
  const net = rawCategorySum - habitCredits;
  const total = Math.max(0, Math.round(net * 10) / 10);
  const diffFromTarget = Math.round(Math.abs(total - dailyTarget) * 10) / 10;
  const isUnderTarget = total <= dailyTarget;

  let verdict = '';
  if (isUnderTarget) {
    if (diffFromTarget === 0) {
      verdict = `Right on your ${dailyTarget} kg target. Nicely balanced day.`;
    } else {
      verdict = `${diffFromTarget} kg under your target. Nicely done.`;
    }
  } else {
    verdict = `${diffFromTarget} kg over your target. A small win or a lighter meal would help.`;
  }

  return {
    total,
    rawCategorySum: Math.round(rawCategorySum * 10) / 10,
    habitCredits: Math.round(habitCredits * 10) / 10,
    isLogged: true,
    isUnderTarget,
    diffFromTarget,
    verdict,
  };
}
