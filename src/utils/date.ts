/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Returns YYYY-MM-DD from a Date object using local time.
 */
export function formatDateKey(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function isFutureDate(key: string): boolean {
  return key > getTodayKey();
}

export function addDays(key: string, days: number): string {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + days);
  return formatDateKey(d);
}

export function formatFriendlyDate(key: string): string {
  const today = getTodayKey();
  const yesterday = addDays(today, -1);
  const date = parseDateKey(key);

  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  if (key === today) {
    return `Today, ${formatted}`;
  }
  if (key === yesterday) {
    return `Yesterday, ${formatted}`;
  }
  return formatted;
}

export function formatShortDay(key: string): { weekday: string; dayNum: string } {
  const date = parseDateKey(key);
  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'narrow' }), // M, T, W...
    dayNum: String(date.getDate()),
  };
}

/**
 * Returns array of 7 date keys ending on `endDateKey`.
 */
export function getLast7DayKeys(endDateKey: string): string[] {
  const result: string[] = [];
  for (let i = 6; i >= 0; i--) {
    result.push(addDays(endDateKey, -i));
  }
  return result;
}
