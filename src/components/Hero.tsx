/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DayCalculation } from '../types';

interface HeroProps {
  calculation: DayCalculation;
  dailyTarget: number;
}

export const Hero: React.FC<HeroProps> = ({ calculation, dailyTarget }) => {
  const { total, isLogged, isUnderTarget, verdict, rawCategorySum, habitCredits } = calculation;

  // Percentage of target for the progress bar (clamped to 100 for base or up to 135% for visual overflow)
  const percentage = dailyTarget > 0 ? (total / dailyTarget) * 100 : 0;
  const barWidth = isLogged ? Math.min(percentage, 100) : 0;
  const isOver = isLogged && !isUnderTarget;

  return (
    <div className="bg-[#F2F6F0] dark:bg-[#18251E] rounded-3xl p-5 sm:p-7 border border-[#D6DFD1] dark:border-[#273B2E] transition-colors relative overflow-hidden shadow-xs">
      {/* Top row: Target reference & Sub-breakdown */}
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm text-[#526859] dark:text-[#8FA596]">
        <div className="flex items-center gap-2">
          <span className="font-medium">Estimated daily footprint</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span>Target: {dailyTarget.toFixed(1)} kg</span>
        </div>
      </div>

      {/* Main Total readout */}
      <div className="mt-3 flex items-baseline gap-2.5">
        <span
          className={`font-display text-5xl sm:text-6xl font-bold tracking-tight tabular-nums transition-colors ${
            !isLogged
              ? 'text-[#67806F] dark:text-[#789382]'
              : isOver
              ? 'text-[#B57A12] dark:text-[#E2A63B]'
              : 'text-[#17261E] dark:text-[#F0F5F1]'
          }`}
        >
          {isLogged ? total.toFixed(1) : '0.0'}
        </span>
        <span className="text-lg sm:text-xl font-medium text-[#526859] dark:text-[#8FA596]">
          kg CO₂e
        </span>

        {isLogged && (
          <div className="ml-auto hidden xs:flex items-center gap-2 text-xs">
            {rawCategorySum > 0 && (
              <span className="text-[#3F5445] dark:text-[#9FB4A6] font-mono">
                +{rawCategorySum.toFixed(1)} gross
              </span>
            )}
            {habitCredits > 0 && (
              <span className="text-[#2F6B43] dark:text-[#4AB374] font-mono font-medium">
                -{habitCredits.toFixed(1)} habits
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progress meter */}
      <div className="mt-5 space-y-1.5">
        <div className="h-3 w-full bg-[#DDE5D8] dark:bg-[#203126] rounded-full overflow-hidden p-0.5 relative">
          {/* Fill bar - animated width only */}
          <div
            style={{ width: `${barWidth}%` }}
            className={`h-full rounded-full transition-all duration-300 ease-out ${
              isOver
                ? 'bg-[#B57A12] dark:bg-[#DFA238]'
                : 'bg-[#2F6B43] dark:bg-[#3FA066]'
            }`}
          />
        </div>

        {/* Meter labels */}
        <div className="flex items-center justify-between text-[11px] text-[#5A7363] dark:text-[#8CA394] font-mono">
          <span>0 kg</span>
          <span>Target: {dailyTarget.toFixed(1)} kg</span>
          <span>{dailyTarget > 0 ? `${Math.round(percentage)}%` : '0%'}</span>
        </div>
      </div>

      {/* Plain language verdict */}
      <div className="mt-4 pt-3.5 border-t border-[#DDE5D8] dark:border-[#223328]">
        <p
          className={`text-sm sm:text-base leading-snug font-medium transition-colors ${
            !isLogged
              ? 'text-[#5A7363] dark:text-[#8CA394]'
              : isOver
              ? 'text-[#875806] dark:text-[#E8AF4A]'
              : 'text-[#204F31] dark:text-[#76C995]'
          }`}
        >
          {verdict}
        </p>
      </div>
    </div>
  );
};
