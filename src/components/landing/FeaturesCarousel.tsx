/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
  BarChart3,
  Sparkles,
  ShieldCheck,
  SunMoon,
} from 'lucide-react';

interface FeatureCard {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  detail: string;
}

const FEATURES: FeatureCard[] = [
  {
    id: 'quick-logging',
    title: 'Quick daily logging',
    category: 'Speed & Simplicity',
    description:
      'Log how you travelled, what you ate, and your home energy in under 60 seconds with frictionless one-tap chips.',
    icon: <Clock className="w-6 h-6 text-[#2F6B43]" />,
    detail: 'No long surveys, forms, or odometer typing.',
  },
  {
    id: 'target-meter',
    title: 'Daily target meter',
    category: 'Instant Feedback',
    description:
      'Watch your estimated kg CO₂e footprint calculate live against a customizable 6.0 kg benchmark with friendly verdicts.',
    icon: <Target className="w-6 h-6 text-[#2F6B43]" />,
    detail: 'Turns amber when over target, never shaming.',
  },
  {
    id: 'trend-chart',
    title: '7-day trend chart',
    category: 'Visual Rhythm',
    description:
      'An inline visual bar chart maps your rolling 7-day trajectory with clear target lines and day-selection shortcuts.',
    icon: <BarChart3 className="w-6 h-6 text-[#2F6B43]" />,
    detail: 'Tap any bar to inspect or edit past records.',
  },
  {
    id: 'habit-wins',
    title: 'Small habit wins',
    category: 'Positive Credits',
    description:
      'Six daily sustainable actions—like line-drying clothes, composting, or using a reusable bottle—actively subtract emissions.',
    icon: <Sparkles className="w-6 h-6 text-[#2F6B43]" />,
    detail: 'Earn up to 1.7 kg of emission credits each day.',
  },
  {
    id: 'private-storage',
    title: 'Private on-device storage',
    category: 'Zero Cloud Tracking',
    description:
      'Everything persists strictly in your browser localStorage. No accounts, no servers, and full JSON export & import.',
    icon: <ShieldCheck className="w-6 h-6 text-[#2F6B43]" />,
    detail: 'Works completely offline after initial load.',
  },
  {
    id: 'notebook-themes',
    title: 'Field-notebook themes',
    category: 'Restful Design',
    description:
      'Calm pale lichen and deep ink palette designed to evoke a naturalist field journal, with an organic dark mode.',
    icon: <SunMoon className="w-6 h-6 text-[#2F6B43]" />,
    detail: 'Respects system preference with instant toggle.',
  },
];

export const FeaturesCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : FEATURES.length - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev < FEATURES.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Features carousel"
      className="relative outline-none"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2F6B43] bg-[#EAF7EE] px-3 py-1 rounded-full border border-[#CFEBD8]">
            Interactive Showcase
          </span>
          <span className="text-xs text-[#17261E]/60 font-mono">
            {currentIndex + 1} of {FEATURES.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous feature"
            className="w-10 h-10 rounded-full frosted-glass-pill flex items-center justify-center text-[#17261E] hover:bg-white transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-[#17261E]" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next feature"
            className="w-10 h-10 rounded-full frosted-glass-pill flex items-center justify-center text-[#17261E] hover:bg-white transition-all active:scale-95"
          >
            <ChevronRight className="w-5 h-5 text-[#17261E]" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden min-h-[300px] sm:min-h-[260px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40) next();
              if (info.offset.x > 40) prev();
            }}
            className="frosted-glass p-7 sm:p-9 cursor-grab active:cursor-grabbing border border-white/80"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#CFEBD8] border border-white flex items-center justify-center shrink-0 shadow-xs">
                {FEATURES[currentIndex].icon}
              </div>
              <span className="text-xs font-mono font-medium text-[#2F6B43] bg-[#EAF7EE] px-3 py-1 rounded-xl self-start sm:self-auto border border-[#CFEBD8]">
                {FEATURES[currentIndex].category}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#17261E] mb-2 tracking-tight">
              {FEATURES[currentIndex].title}
            </h3>

            <p className="text-[#17261E]/80 text-base sm:text-lg leading-relaxed max-w-2xl mb-4">
              {FEATURES[currentIndex].description}
            </p>

            <div className="pt-4 border-t border-[#CFEBD8]/60 flex items-center gap-2 text-xs sm:text-sm text-[#2F6B43] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5FB37C]" />
              <span>{FEATURES[currentIndex].detail}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {FEATURES.map((feat, idx) => (
          <button
            key={feat.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}: ${feat.title}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? 'w-8 bg-[#5FB37C]'
                : 'w-2.5 bg-[#CFEBD8] hover:bg-[#A9D8B8]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesCarousel;
