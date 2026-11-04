/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Coffee, Home, Navigation, Sparkles, Trash2 } from 'lucide-react';
import { CATEGORIES, HABITS } from '../constants/footprintModel';
import { CategoryId, DayEntry } from '../types';

interface DailyLogProps {
  entry: DayEntry;
  onChange: (updated: DayEntry) => void;
  onClearDay: () => void;
}

export const DailyLog: React.FC<DailyLogProps> = ({
  entry,
  onChange,
  onClearDay,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSelectCategoryOption = (categoryId: CategoryId, optionId: string) => {
    // Tapping a selected chip deselects it
    const currentVal = entry[categoryId];
    const nextVal = currentVal === optionId ? undefined : optionId;

    onChange({
      ...entry,
      [categoryId]: nextVal,
      isRestDay: false, // logging options exits rest day mode
    });
  };

  const handleToggleHabit = (habitId: string) => {
    const currentHabits = entry.habits || [];
    const exists = currentHabits.includes(habitId);
    const nextHabits = exists
      ? currentHabits.filter((id) => id !== habitId)
      : [...currentHabits, habitId];

    onChange({
      ...entry,
      habits: nextHabits,
      isRestDay: false,
    });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...entry,
      note: e.target.value,
    });
  };

  const handleToggleRestDay = () => {
    const nextRest = !entry.isRestDay;
    onChange({
      ...entry,
      isRestDay: nextRest,
      // If toggled into rest day, we can keep or leave options, but let's toggle flag
    });
  };

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'gettingAround':
        return <Navigation className="w-4 h-4 text-[#2F6B43] dark:text-[#3FA066]" />;
      case 'food':
        return <Coffee className="w-4 h-4 text-[#2F6B43] dark:text-[#3FA066]" />;
      case 'energy':
        return <Home className="w-4 h-4 text-[#2F6B43] dark:text-[#3FA066]" />;
    }
  };

  const hasAnyData =
    Boolean(entry.gettingAround) ||
    Boolean(entry.food) ||
    Boolean(entry.energy) ||
    (entry.habits && entry.habits.length > 0) ||
    Boolean(entry.note) ||
    Boolean(entry.isRestDay);

  return (
    <div className="space-y-6">
      {/* 3 Single-Choice Categories */}
      {CATEGORIES.map((category) => {
        const selectedId = entry[category.id];

        return (
          <section
            key={category.id}
            className="p-5 sm:p-6 bg-[#F2F6F0] dark:bg-[#18251E] rounded-3xl border border-[#D6DFD1] dark:border-[#273B2E] transition-colors"
          >
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                {getCategoryIcon(category.id)}
                <h3 className="font-semibold text-base sm:text-lg text-[#17261E] dark:text-[#F0F5F1]">
                  {category.name}
                </h3>
              </div>
              <span className="text-xs text-[#526859] dark:text-[#8FA596]">
                {category.subtitle}
              </span>
            </div>

            {/* Chips Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {category.options.map((opt) => {
                const isSelected = selectedId === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectCategoryOption(category.id, opt.id)}
                    className={`min-h-[48px] px-3.5 py-2.5 rounded-2xl flex flex-col justify-center items-start text-left transition-all ${
                      isSelected
                        ? 'bg-[#2F6B43] text-white shadow-xs dark:bg-[#3FA066] dark:text-[#0C150F]'
                        : 'bg-[#E3EDE0] text-[#17261E] hover:bg-[#D7E4D3] dark:bg-[#203126] dark:text-[#D8E6DB] dark:hover:bg-[#273D2F]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full gap-1">
                      <span className="font-medium text-xs sm:text-sm leading-tight line-clamp-1">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-mono mt-0.5 tabular-nums ${
                        isSelected
                          ? 'text-white/85 dark:text-[#0C150F]/80 font-medium'
                          : 'text-[#526859] dark:text-[#8FA596]'
                      }`}
                    >
                      {opt.value === 0 ? '0 kg' : `+${opt.value.toFixed(1)} kg`}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* 6 Multi-Select Toggle Habits */}
      <section className="p-5 sm:p-6 bg-[#F2F6F0] dark:bg-[#18251E] rounded-3xl border border-[#D6DFD1] dark:border-[#273B2E] transition-colors">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2F6B43] dark:text-[#3FA066]" />
            <h3 className="font-semibold text-base sm:text-lg text-[#17261E] dark:text-[#F0F5F1]">
              Daily eco-habits
            </h3>
          </div>
          <span className="text-xs text-[#2F6B43] dark:text-[#3FA066] font-medium">
            Subtracted from footprint
          </span>
        </div>

        <p className="text-xs text-[#526859] dark:text-[#8FA596] mb-3">
          Select any small wins you kept today. Each subtracts directly from your total.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
          {HABITS.map((habit) => {
            const isChecked = (entry.habits || []).includes(habit.id);

            return (
              <button
                key={habit.id}
                type="button"
                onClick={() => handleToggleHabit(habit.id)}
                className={`min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-left transition-all ${
                  isChecked
                    ? 'bg-[#E0EEE3] border border-[#2F6B43]/40 text-[#12311C] dark:bg-[#1C3626] dark:border-[#3FA066]/50 dark:text-[#E2EFE5]'
                    : 'bg-[#E3EDE0] border border-transparent text-[#17261E] hover:bg-[#D7E4D3] dark:bg-[#203126] dark:text-[#D8E6DB] dark:hover:bg-[#273D2F]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                      isChecked
                        ? 'bg-[#2F6B43] text-white dark:bg-[#3FA066] dark:text-[#0C150F]'
                        : 'border border-[#9CB0A2] dark:border-[#465E4F]'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                  </div>
                  <span className="font-medium text-xs sm:text-sm leading-tight">
                    {habit.label}
                  </span>
                </div>

                <span
                  className={`text-xs font-mono font-medium tabular-nums shrink-0 ${
                    isChecked
                      ? 'text-[#204F31] dark:text-[#56C381]'
                      : 'text-[#526859] dark:text-[#8FA596]'
                  }`}
                >
                  -{habit.credit.toFixed(1)} kg
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Daily Note & Rest day toggle */}
      <section className="p-5 sm:p-6 bg-[#F2F6F0] dark:bg-[#18251E] rounded-3xl border border-[#D6DFD1] dark:border-[#273B2E] transition-colors space-y-4">
        <div>
          <label
            htmlFor="daily-note"
            className="block text-xs font-semibold uppercase tracking-wider text-[#526859] dark:text-[#8FA596] mb-1.5"
          >
            Daily note (optional)
          </label>
          <textarea
            id="daily-note"
            rows={2}
            value={entry.note || ''}
            onChange={handleNoteChange}
            placeholder="E.g., Batch cooked lentil soup, worked from patio without heating..."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-[#E3EDE0] dark:bg-[#203126] text-[#17261E] dark:text-[#F0F5F1] placeholder-[#738C7B] dark:placeholder-[#647C6C] text-sm resize-none border border-transparent focus:border-[#2F6B43] dark:focus:border-[#3FA066] transition-colors"
          />
        </div>

        {/* Rest Day / Pause toggle */}
        <div className="pt-2 flex items-center justify-between border-t border-[#DDE5D8] dark:border-[#223328]">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-medium text-[#17261E] dark:text-[#F0F5F1]">
              Mark as rest day
            </span>
            <span className="text-[11px] text-[#526859] dark:text-[#8FA596]">
              Keep streak safe when traveling, sick, or taking a planned pause
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleRestDay}
            className={`min-h-[44px] px-3.5 py-1.5 text-xs font-medium rounded-xl transition-colors ${
              entry.isRestDay
                ? 'bg-[#2F6B43] text-white dark:bg-[#3FA066] dark:text-[#0C150F]'
                : 'bg-[#E3EDE0] text-[#344A3A] hover:bg-[#D7E4D3] dark:bg-[#203126] dark:text-[#BDCEBF]'
            }`}
          >
            {entry.isRestDay ? 'Rest day active' : 'Mark rest day'}
          </button>
        </div>

        {/* Clear this day action */}
        {hasAnyData && (
          <div className="pt-3 border-t border-[#DDE5D8] dark:border-[#223328] flex items-center justify-end">
            {!showClearConfirm ? (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold text-[#8C2E2E] dark:text-[#E57373] hover:bg-[#FBE8E8] dark:hover:bg-[#341B1B] rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear this day
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8C2E2E] dark:text-[#E57373]">
                  Clear entries for this day?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClearDay();
                    setShowClearConfirm(false);
                  }}
                  className="min-h-[44px] px-3 py-1.5 text-xs font-semibold bg-[#8C2E2E] text-white rounded-xl hover:bg-[#722323] transition-colors"
                >
                  Yes, clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="min-h-[44px] px-3 py-1.5 text-xs font-medium text-[#526859] dark:text-[#8FA596] hover:bg-[#E3EDE0] dark:hover:bg-[#203126] rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
