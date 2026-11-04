/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DayEntry } from '../types';
import { formatShortDay, getLast7DayKeys, parseDateKey } from '../utils/date';
import { calculateDayFootprint, isDayLogged } from '../utils/footprint';

interface WeekChartProps {
  entries: Record<string, DayEntry>;
  selectedDate: string;
  dailyTarget: number;
  onSelectDate: (dateKey: string) => void;
  isDark: boolean;
}

export const WeekChart: React.FC<WeekChartProps> = ({
  entries,
  selectedDate,
  dailyTarget,
  onSelectDate,
  isDark,
}) => {
  const weekDayKeys = getLast7DayKeys(selectedDate);

  const daysData = weekDayKeys.map((key) => {
    const entry = entries[key];
    const logged = isDayLogged(entry);
    const calc = calculateDayFootprint(entry, dailyTarget);
    const shortInfo = formatShortDay(key);
    const isSelected = key === selectedDate;
    const isRest = Boolean(entry?.isRestDay);

    return {
      key,
      weekday: shortInfo.weekday,
      dayNum: shortInfo.dayNum,
      isLogged: logged,
      isRest,
      total: calc.total,
      isUnderTarget: calc.isUnderTarget,
      isSelected,
    };
  });

  // Determine chart scale: at least dailyTarget * 1.3 or highest day's value
  const maxLoggedVal = Math.max(...daysData.filter((d) => d.isLogged).map((d) => d.total), 0);
  const chartMaxVal = Math.max(dailyTarget * 1.35, maxLoggedVal * 1.15, 8.0);

  // SVG dimensions
  const svgWidth = 350;
  const svgHeight = 170;
  const paddingLeft = 32;
  const paddingRight = 16;
  const paddingTop = 26;
  const paddingBottom = 32;

  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;
  const groundY = paddingTop + plotHeight;

  // Target line Y
  const targetY = groundY - (dailyTarget / chartMaxVal) * plotHeight;

  // Bar slot math
  const slotWidth = plotWidth / 7;
  const barWidth = 26;

  // Theme colors
  const underColor = isDark ? '#3FA066' : '#2F6B43';
  const overColor = isDark ? '#E2A63B' : '#B57A12';
  const unloggedColor = isDark ? '#2B3E32' : '#D6DFD1';
  const targetLineColor = isDark ? '#5C7464' : '#8A9F90';
  const textColor = isDark ? '#9EB3A5' : '#556C5C';
  const selectedRingColor = isDark ? '#81E2A5' : '#17261E';

  return (
    <section className="p-5 sm:p-6 bg-[#F2F6F0] dark:bg-[#18251E] rounded-3xl border border-[#D6DFD1] dark:border-[#273B2E] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-base sm:text-lg text-[#17261E] dark:text-[#F0F5F1]">
            7-day trend
          </h3>
          <p className="text-xs text-[#526859] dark:text-[#8FA596]">
            Ending on {parseDateKey(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · Tap any bar to view that day
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F6B43] dark:bg-[#3FA066]" />
            <span className="text-[#526859] dark:text-[#8FA596]">Under</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B57A12] dark:bg-[#E2A63B]" />
            <span className="text-[#526859] dark:text-[#8FA596]">Over</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="w-full overflow-x-auto touch-pan-x">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none overflow-visible"
          role="img"
          aria-label="7-day carbon footprint bar chart"
        >
          {/* Target line */}
          <line
            x1={paddingLeft}
            y1={targetY}
            x2={svgWidth - paddingRight}
            y2={targetY}
            stroke={targetLineColor}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Target label */}
          <text
            x={paddingLeft - 4}
            y={targetY + 3}
            textAnchor="end"
            fontSize="9"
            fontFamily="monospace"
            fill={textColor}
          >
            {dailyTarget.toFixed(0)}k
          </text>

          {/* Baseline zero line */}
          <line
            x1={paddingLeft}
            y1={groundY}
            x2={svgWidth - paddingRight}
            y2={groundY}
            stroke={isDark ? '#273B2E' : '#D6DFD1'}
            strokeWidth="1"
          />

          {/* 7 Bars */}
          {daysData.map((d, idx) => {
            const slotCenterX = paddingLeft + idx * slotWidth + slotWidth / 2;
            const barX = slotCenterX - barWidth / 2;

            const barHeight = d.isLogged
              ? Math.max(4, (d.total / chartMaxVal) * plotHeight)
              : 6;
            const barY = groundY - barHeight;

            const barFill = !d.isLogged
              ? unloggedColor
              : d.isUnderTarget
              ? underColor
              : overColor;

            return (
              <g
                key={d.key}
                onClick={() => onSelectDate(d.key)}
                className="cursor-pointer group"
                tabIndex={0}
                role="button"
                aria-label={`${d.key}: ${d.isLogged ? `${d.total} kg` : 'unlogged'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDate(d.key);
                  }
                }}
              >
                {/* Hit area for generous tap */}
                <rect
                  x={barX - 4}
                  y={paddingTop}
                  width={barWidth + 8}
                  height={plotHeight + paddingBottom}
                  fill="transparent"
                />

                {/* Selected day indicator pill around column */}
                {d.isSelected && (
                  <rect
                    x={barX - 3}
                    y={paddingTop - 6}
                    width={barWidth + 6}
                    height={plotHeight + 36}
                    rx="12"
                    fill="none"
                    stroke={selectedRingColor}
                    strokeWidth="1.5"
                    strokeDasharray={d.isLogged ? 'none' : '3 3'}
                    opacity="0.85"
                  />
                )}

                {/* Actual Bar */}
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx="5"
                  fill={barFill}
                  className="transition-all duration-200 group-hover:opacity-85"
                  stroke={!d.isLogged ? (isDark ? '#3D5444' : '#C2CFC0') : 'none'}
                  strokeWidth={!d.isLogged ? '1' : '0'}
                  strokeDasharray={!d.isLogged ? '2 2' : 'none'}
                />

                {/* Kg label above bar if logged */}
                {d.isLogged && (
                  <text
                    x={slotCenterX}
                    y={Math.max(14, barY - 4)}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="600"
                    fontFamily="monospace"
                    fill={d.isUnderTarget ? underColor : overColor}
                  >
                    {d.total.toFixed(1)}
                  </text>
                )}

                {/* Unlogged placeholder text if not logged */}
                {!d.isLogged && (
                  <text
                    x={slotCenterX}
                    y={groundY - 10}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fill={textColor}
                    opacity="0.6"
                  >
                    —
                  </text>
                )}

                {/* X Axis Day Label */}
                <text
                  x={slotCenterX}
                  y={groundY + 14}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={d.isSelected ? '700' : '500'}
                  fill={d.isSelected ? (isDark ? '#F0F5F1' : '#17261E') : textColor}
                >
                  {d.weekday}
                </text>

                <text
                  x={slotCenterX}
                  y={groundY + 25}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fill={d.isSelected ? (isDark ? '#F0F5F1' : '#17261E') : textColor}
                  opacity={d.isSelected ? '1' : '0.8'}
                >
                  {d.dayNum}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
};
