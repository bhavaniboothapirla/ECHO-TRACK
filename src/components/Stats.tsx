/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Flame, Target } from 'lucide-react';
import { WeeklyStats } from '../types';

interface StatsProps {
  stats: WeeklyStats;
  dailyTarget: number;
}

export const Stats: React.FC<StatsProps> = ({ stats, dailyTarget }) => {
  const { averageKg, streak, daysUnderTarget, loggedDaysCount } = stats;

  return (
    <section className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
      {/* Stat 1: Weekly Average */}
      <div className="p-3.5 sm:p-4 bg-[#F2F6F0] dark:bg-[#18251E] rounded-2xl border border-[#D6DFD1] dark:border-[#273B2E] flex flex-col justify-between transition-colors">
        <div className="flex items-center gap-1.5 text-xs text-[#526859] dark:text-[#8FA596]">
          <Target className="w-3.5 h-3.5 text-[#2F6B43] dark:text-[#3FA066]" />
          <span className="font-medium truncate">7-day avg</span>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold font-display text-[#17261E] dark:text-[#F0F5F1] tabular-nums">
              {loggedDaysCount > 0 ? averageKg.toFixed(1) : '—'}
            </span>
            <span className="text-[11px] text-[#526859] dark:text-[#8FA596]">
              kg/day
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#5A7363] dark:text-[#8CA394] font-mono block mt-0.5">
            Target {dailyTarget.toFixed(1)} kg
          </span>
        </div>
      </div>

      {/* Stat 2: Consecutive Streak */}
      <div className="p-3.5 sm:p-4 bg-[#F2F6F0] dark:bg-[#18251E] rounded-2xl border border-[#D6DFD1] dark:border-[#273B2E] flex flex-col justify-between transition-colors">
        <div className="flex items-center gap-1.5 text-xs text-[#526859] dark:text-[#8FA596]">
          <Flame className="w-3.5 h-3.5 text-[#B57A12] dark:text-[#E2A63B]" />
          <span className="font-medium truncate">Logging streak</span>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold font-display text-[#17261E] dark:text-[#F0F5F1] tabular-nums">
              {streak}
            </span>
            <span className="text-[11px] text-[#526859] dark:text-[#8FA596]">
              {streak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#5A7363] dark:text-[#8CA394] block mt-0.5">
            {streak >= 3 ? 'Great momentum' : 'Keep it up'}
          </span>
        </div>
      </div>

      {/* Stat 3: Days under target */}
      <div className="p-3.5 sm:p-4 bg-[#F2F6F0] dark:bg-[#18251E] rounded-2xl border border-[#D6DFD1] dark:border-[#273B2E] flex flex-col justify-between transition-colors">
        <div className="flex items-center gap-1.5 text-xs text-[#526859] dark:text-[#8FA596]">
          <Award className="w-3.5 h-3.5 text-[#2F6B43] dark:text-[#3FA066]" />
          <span className="font-medium truncate">Under target</span>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold font-display text-[#17261E] dark:text-[#F0F5F1] tabular-nums">
              {daysUnderTarget}
            </span>
            <span className="text-[11px] text-[#526859] dark:text-[#8FA596]">
              of 7 days
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#5A7363] dark:text-[#8CA394] block mt-0.5">
            {loggedDaysCount === 0 ? 'No logs yet' : `${loggedDaysCount} logged`}
          </span>
        </div>
      </div>
    </section>
  );
};
