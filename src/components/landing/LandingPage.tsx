/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Compass,
  Flame,
  Leaf,
  Shield,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { LandingBackground3D } from './LandingBackground3D';
import { LandingNavbar } from './LandingNavbar';
import { FeaturesCarousel } from './FeaturesCarousel';

interface LandingPageProps {
  onLaunch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-[#17261E] selection:bg-[#CFEBD8] selection:text-[#17261E] font-sans antialiased overflow-x-hidden">
      {/* 3D Scene in fixed canvas behind everything */}
      <LandingBackground3D />

      {/* Sticky frosted glass navbar */}
      <LandingNavbar onLaunch={onLaunch} />

      {/* Content wrapper with scroll-smooth sections */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32 py-10 sm:py-16">
        
        {/* ========================================================= */}
        {/* SECTION 1: HERO */}
        {/* ========================================================= */}
        <section
          id="hero"
          className="min-h-[82vh] flex flex-col justify-center items-center text-center pt-8 sm:pt-14 pb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full frosted-glass-pill text-xs font-medium text-[#2F6B43] mb-6 border border-white/80 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#5FB37C]" />
            <span>Private on-device sustainability logger</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#17261E] max-w-3xl leading-[1.08] text-balance mb-6"
          >
            Know your footprint. <br className="hidden sm:inline" />
            <span className="text-[#2F6B43]">Shape your day.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-[#17261E]/80 max-w-xl text-balance mb-8 font-normal leading-relaxed"
          >
            Log your day in under a minute and see your impact in kg of CO₂e.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
          >
            <button
              type="button"
              onClick={onLaunch}
              className="w-full sm:w-auto min-h-[50px] px-8 py-3 rounded-2xl bg-[#5FB37C] hover:bg-[#4FA36C] text-white font-semibold text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              <span>Launch EchoTrack</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollTo('how-it-works')}
              className="w-full sm:w-auto min-h-[50px] px-6 py-3 rounded-2xl frosted-glass text-[#17261E] hover:bg-white/80 font-medium text-base flex items-center justify-center gap-2 transition-all"
            >
              <span>See how it works</span>
              <ChevronDown className="w-4 h-4 text-[#2F6B43]" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 text-xs text-[#17261E]/60 flex items-center gap-4"
          >
            <span>Under 60s per log</span>
            <span>·</span>
            <span>Zero accounts or tracking</span>
            <span>·</span>
            <span>Works 100% offline</span>
          </motion.div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: HOW IT WORKS */}
        {/* ========================================================= */}
        <section id="how-it-works" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2F6B43] bg-[#EAF7EE] px-3 py-1 rounded-full border border-[#CFEBD8]">
              Three simple steps
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17261E]">
              How it works
            </h2>
            <p className="text-[#17261E]/75 text-base sm:text-lg">
              Designed for effortless consistency without tedious forms or data capture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="frosted-glass p-7 flex flex-col justify-between group hover:border-[#CFEBD8] transition-all"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#CFEBD8] border border-white flex items-center justify-center text-[#2F6B43] font-bold text-lg mb-5 shadow-xs">
                  01
                </div>
                <h3 className="font-display text-xl font-bold text-[#17261E] mb-2.5">
                  Log your day
                </h3>
                <p className="text-sm text-[#17261E]/75 leading-relaxed">
                  Tap single-choice chips for your travel, meals, and home energy. Six eco-habit toggles like composting and reuse subtract from your total.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#CFEBD8]/50 text-xs font-mono text-[#2F6B43] flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Under 60 seconds</span>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="frosted-glass p-7 flex flex-col justify-between group hover:border-[#CFEBD8] transition-all"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#CFEBD8] border border-white flex items-center justify-center text-[#2F6B43] font-bold text-lg mb-5 shadow-xs">
                  02
                </div>
                <h3 className="font-display text-xl font-bold text-[#17261E] mb-2.5">
                  See your footprint
                </h3>
                <p className="text-sm text-[#17261E]/75 leading-relaxed">
                  Get instant live feedback in kg CO₂e against a personal daily target (default 6 kg). Progress meters and encouraging verdicts guide your trajectory.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#CFEBD8]/50 text-xs font-mono text-[#2F6B43] flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Live live calculation</span>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="frosted-glass p-7 flex flex-col justify-between group hover:border-[#CFEBD8] transition-all"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#CFEBD8] border border-white flex items-center justify-center text-[#2F6B43] font-bold text-lg mb-5 shadow-xs">
                  03
                </div>
                <h3 className="font-display text-xl font-bold text-[#17261E] mb-2.5">
                  Build your streak
                </h3>
                <p className="text-sm text-[#17261E]/75 leading-relaxed">
                  Track consecutive logging streaks and review rolling 7-day bar charts. Optional rest-day allowances ensure life’s interruptions don’t break motivation.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#CFEBD8]/50 text-xs font-mono text-[#2F6B43] flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Long-term habit mastery</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: FEATURES (CAROUSEL) */}
        {/* ========================================================= */}
        <section id="features" className="scroll-mt-24 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-2">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17261E]">
              Engineered for mindful living
            </h2>
            <p className="text-[#17261E]/75 text-base sm:text-lg">
              Explore the core capabilities that make EchoTrack fast, private, and rewarding.
            </p>
          </div>

          <FeaturesCarousel />
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: LIVE PREVIEW (STATIC ILLUSTRATION MOCKUP) */}
        {/* ========================================================= */}
        <section id="preview" className="scroll-mt-24 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2F6B43] bg-[#EAF7EE] px-3 py-1 rounded-full border border-[#CFEBD8]">
              UI Preview
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17261E]">
              Calm, uncluttered interface
            </h2>
            <p className="text-[#17261E]/75 text-base sm:text-lg">
              Here is what your daily dashboard looks like in action.
            </p>
          </div>

          {/* Static mockup card */}
          <div className="max-w-xl mx-auto frosted-glass p-6 sm:p-8 border border-white/90 shadow-lg">
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#CFEBD8]/60 text-xs text-[#17261E]/70 font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2F6B43]" />
                <span className="font-semibold text-[#17261E]">Today, Wednesday, Nov 4</span>
              </div>
              <span className="bg-[#EAF7EE] text-[#2F6B43] px-2.5 py-0.5 rounded-full font-sans font-medium">
                Live Simulation
              </span>
            </div>

            {/* Mock Hero Total */}
            <div className="py-6">
              <div className="flex items-center justify-between text-xs text-[#17261E]/70 mb-1">
                <span>Estimated footprint</span>
                <span className="font-mono">Target: 6.0 kg</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl font-bold tracking-tight text-[#17261E] tabular-nums">
                  4.2
                </span>
                <span className="text-lg font-medium text-[#17261E]/70">
                  kg CO₂e
                </span>

                <div className="ml-auto flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#17261E]/60">+4.9 gross</span>
                  <span className="text-[#2F6B43] font-semibold">-0.7 habits</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 space-y-1">
                <div className="h-3 w-full bg-[#EAF7EE] rounded-full overflow-hidden p-0.5 border border-[#CFEBD8]/60">
                  <div
                    style={{ width: '70%' }}
                    className="h-full rounded-full bg-[#5FB37C] transition-all"
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-[#17261E]/60">
                  <span>0 kg</span>
                  <span>Target: 6.0 kg</span>
                  <span>70%</span>
                </div>
              </div>

              {/* Verdict */}
              <div className="mt-4 pt-3 border-t border-[#CFEBD8]/60">
                <p className="text-sm font-semibold text-[#2F6B43]">
                  1.8 kg under your target. Nicely done.
                </p>
              </div>
            </div>

            {/* Mock Chips Preview */}
            <div className="pt-4 border-t border-[#CFEBD8]/60 space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#17261E]/60">
                Selected Choices
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="px-2.5 py-1 rounded-xl bg-[#5FB37C] text-white font-medium flex items-center gap-1">
                  <span>Public transit</span>
                  <span className="opacity-80 font-mono">+0.9</span>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#5FB37C] text-white font-medium flex items-center gap-1">
                  <span>Plant-based meal</span>
                  <span className="opacity-80 font-mono">+1.5</span>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#5FB37C] text-white font-medium flex items-center gap-1">
                  <span>Typical energy</span>
                  <span className="opacity-80 font-mono">+3.0</span>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#CFEBD8] text-[#17261E] font-medium border border-[#A9D8B8]/60 flex items-center gap-1">
                  <span>Sorted waste</span>
                  <span className="text-[#2F6B43] font-mono font-semibold">-0.3</span>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#CFEBD8] text-[#17261E] font-medium border border-[#A9D8B8]/60 flex items-center gap-1">
                  <span>Line-dried</span>
                  <span className="text-[#2F6B43] font-mono font-semibold">-0.5</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: WHY IT MATTERS */}
        {/* ========================================================= */}
        <section id="why-it-matters" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17261E]">
              Why daily tracking matters
            </h2>
            <p className="text-[#17261E]/75 text-base sm:text-lg">
              Sustainable living starts with rapid intuition rather than yearly guilt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="frosted-glass p-7 space-y-3 border border-white/80">
              <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] flex items-center justify-center text-[#2F6B43]">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#17261E]">
                Daily awareness
              </h3>
              <p className="text-sm text-[#17261E]/75 leading-relaxed">
                Household decisions—from what you eat for dinner to how you commute—form the foundation of everyday environmental impact.
              </p>
            </div>

            <div className="frosted-glass p-7 space-y-3 border border-white/80">
              <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] flex items-center justify-center text-[#2F6B43]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#17261E]">
                Actionable feedback
              </h3>
              <p className="text-sm text-[#17261E]/75 leading-relaxed">
                Immediate daily reflection builds stronger environmental intuition than once-a-year carbon audits that leave no ongoing guidance.
              </p>
            </div>

            <div className="frosted-glass p-7 space-y-3 border border-white/80">
              <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] flex items-center justify-center text-[#2F6B43]">
                <Flame className="w-5 h-5 text-[#B57A12]" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#17261E]">
                Habit reinforcement
              </h3>
              <p className="text-sm text-[#17261E]/75 leading-relaxed">
                Gentle streak tracking turns one-off good intentions into sustainable, lasting everyday routines that compound over time.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: FINAL CALL TO ACTION */}
        {/* ========================================================= */}
        <section className="pt-6">
          <div className="frosted-glass p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6 border border-white shadow-xl relative overflow-hidden">
            <div className="w-14 h-14 rounded-3xl bg-[#CFEBD8] border border-white flex items-center justify-center mx-auto text-[#2F6B43] shadow-xs">
              <Leaf className="w-7 h-7" strokeWidth={2.2} />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#17261E]">
                Start your first log today
              </h2>
              <p className="text-[#17261E]/75 text-base sm:text-lg max-w-lg mx-auto">
                No accounts, no setup, no tracking. Ready in under 60 seconds.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onLaunch}
                className="min-h-[52px] px-9 py-3.5 rounded-2xl bg-[#5FB37C] hover:bg-[#4FA36C] text-white font-semibold text-base sm:text-lg inline-flex items-center gap-2.5 shadow-lg hover:shadow-xl transition-all active:scale-98"
              >
                <span>Launch EchoTrack</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#2F6B43] pt-4">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5FB37C]" />
                100% Free & Open
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5FB37C]" />
                Private on-device storage
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5FB37C]" />
                Works offline
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 7: FOOTER */}
        {/* ========================================================= */}
        <footer className="pt-8 pb-12 border-t border-[#CFEBD8]/60 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#17261E]">
            <Leaf className="w-4 h-4 text-[#2F6B43]" />
            <span className="font-display">EchoTrack</span>
          </div>

          <p className="text-xs text-[#17261E]/60 max-w-xl mx-auto leading-relaxed">
            Figures are rough estimates for daily reflection, not audited lifecycle carbon accounting. No tracking cookies or external analytics are used.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-xs font-medium text-[#2F6B43]">
            <button
              type="button"
              onClick={onLaunch}
              className="hover:underline flex items-center gap-1"
            >
              <span>Launch application</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:underline"
            >
              Back to top
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;
