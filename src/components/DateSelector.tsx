/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, formatFriendlyDate, getTodayKey, isFutureDate } from '../utils/date';

interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const todayKey = getTodayKey();
  const isToday = selectedDate === todayKey;
  const nextDate = addDays(selectedDate, 1);
  const canGoNext = !isFutureDate(nextDate);

  const handlePrev = () => {
    onSelectDate(addDays(selectedDate, -1));
  };

  const handleNext = () => {
    if (canGoNext) {
      onSelectDate(nextDate);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val && !isFutureDate(val)) {
      onSelectDate(val);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 p-2 bg-[#F2F6F0] dark:bg-[#18251E] rounded-2xl border border-[#D6DFD1] dark:border-[#273B2E] transition-colors">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous day"
          className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#2A3F32] dark:text-[#C5D6C9] hover:bg-[#E3EDE0] dark:hover:bg-[#203126] active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}
          className="min-h-[44px] px-3 rounded-xl flex items-center gap-2 hover:bg-[#E3EDE0] dark:hover:bg-[#203126] transition-colors text-left group"
        >
          <Calendar className="w-4 h-4 text-[#2F6B43] dark:text-[#3FA066] shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-sm sm:text-base text-[#17261E] dark:text-[#F0F5F1] leading-tight">
              {formatFriendlyDate(selectedDate)}
            </span>
            <span className="text-[11px] text-[#5A7363] dark:text-[#8CA394] font-mono leading-none mt-0.5">
              {selectedDate}
            </span>
          </div>
        </button>

        {/* Hidden native date input with max set to today */}
        <input
          ref={dateInputRef}
          type="date"
          max={todayKey}
          value={selectedDate}
          onChange={handleDateChange}
          className="sr-only"
          aria-label="Select date"
        />
      </div>

      <div className="flex items-center gap-1">
        {!isToday && (
          <button
            type="button"
            onClick={() => onSelectDate(todayKey)}
            className="min-h-[44px] px-3 py-1 text-xs font-semibold text-[#2F6B43] dark:text-[#3FA066] hover:bg-[#E3EDE0] dark:hover:bg-[#203126] rounded-xl transition-colors"
          >
            Jump to today
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label="Next day"
          title={!canGoNext ? 'Cannot log future dates' : 'Next day'}
          className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-all ${
            canGoNext
              ? 'text-[#2A3F32] dark:text-[#C5D6C9] hover:bg-[#E3EDE0] dark:hover:bg-[#203126] active:scale-95'
              : 'text-[#9CB0A2]/50 dark:text-[#4A6152]/40 cursor-not-allowed opacity-50'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
