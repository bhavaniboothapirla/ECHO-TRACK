/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, X } from 'lucide-react';
import { CATEGORIES, DISCLAIMER_TEXT, HABITS } from '../constants/footprintModel';

interface EstimatesInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EstimatesInfoModal: React.FC<EstimatesInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="estimates-modal-title"
    >
      <div
        className="w-full max-w-lg bg-[#F2F6F0] dark:bg-[#18251E] rounded-3xl border border-[#D6DFD1] dark:border-[#273B2E] shadow-xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#D6DFD1] dark:border-[#273B2E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2F6B43]/15 dark:bg-[#3FA066]/20 flex items-center justify-center text-[#2F6B43] dark:text-[#3FA066]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="estimates-modal-title"
                className="font-display text-lg font-bold text-[#17261E] dark:text-[#F0F5F1]"
              >
                How estimates work
              </h2>
              <p className="text-xs text-[#526859] dark:text-[#8FA596]">
                Transparent, simplified footprint modeling
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#526859] dark:text-[#8FA596] hover:bg-[#E3EDE0] dark:hover:bg-[#203126] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs sm:text-sm text-[#344A3A] dark:text-[#CBD9CE]">
          <div className="p-3.5 bg-[#E3EDE0] dark:bg-[#203126] rounded-2xl border border-[#D6DFD1] dark:border-[#2B3E32]">
            <p className="font-medium text-[#17261E] dark:text-[#F0F5F1] leading-relaxed">
              {DISCLAIMER_TEXT}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-[#17261E] dark:text-[#F0F5F1] mb-2">
              The 60-Second Philosophy
            </h4>
            <p className="leading-relaxed">
              EchoTrack is designed for fast, frictionless daily reflection rather than complex audits. Instead of asking you for odometer readings or wattage specs, it uses rounded benchmark figures based on average IPCC & DEFRA factors.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-[#17261E] dark:text-[#F0F5F1]">
              Category Breakdown
            </h4>

            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="border-t border-[#DDE5D8] dark:border-[#24352A] pt-2">
                <span className="font-medium text-[#17261E] dark:text-[#F0F5F1]">
                  {cat.name}:
                </span>
                <ul className="mt-1 space-y-1 text-xs">
                  {cat.options.map((opt) => (
                    <li key={opt.id} className="flex justify-between items-center text-[#526859] dark:text-[#9FB4A6]">
                      <span>{opt.label}</span>
                      <span className="font-mono tabular-nums font-medium text-[#17261E] dark:text-[#E4EBE5]">
                        +{opt.value.toFixed(1)} kg
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-[#DDE5D8] dark:border-[#24352A] pt-3">
            <h4 className="font-semibold text-sm text-[#17261E] dark:text-[#F0F5F1] mb-1.5">
              Habits (Subtracted Credits)
            </h4>
            <ul className="space-y-1 text-xs">
              {HABITS.map((h) => (
                <li key={h.id} className="flex justify-between items-center text-[#526859] dark:text-[#9FB4A6]">
                  <span>{h.label}</span>
                  <span className="font-mono tabular-nums font-medium text-[#2F6B43] dark:text-[#3FA066]">
                    -{h.credit.toFixed(1)} kg
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-[#E8EDE4] dark:bg-[#121915] border-t border-[#D6DFD1] dark:border-[#273B2E] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-[#2F6B43] hover:bg-[#265736] text-white dark:bg-[#3FA066] dark:text-[#0C150F] text-xs font-semibold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
