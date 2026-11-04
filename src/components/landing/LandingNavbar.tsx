/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, Leaf, Menu, X } from 'lucide-react';

interface LandingNavbarProps {
  onLaunch: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onLaunch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="frosted-glass-nav sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('hero');
          }}
          className="flex items-center gap-2.5 text-[#17261E] group"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#CFEBD8] border border-white/80 flex items-center justify-center text-[#17261E] shadow-xs group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-[#2F6B43]" strokeWidth={2.2} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-[#17261E]">
            EchoTrack
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#17261E]/80">
          <button
            type="button"
            onClick={() => scrollTo('how-it-works')}
            className="hover:text-[#17261E] transition-colors"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => scrollTo('features')}
            className="hover:text-[#17261E] transition-colors"
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => scrollTo('preview')}
            className="hover:text-[#17261E] transition-colors"
          >
            Live preview
          </button>
          <button
            type="button"
            onClick={() => scrollTo('why-it-matters')}
            className="hover:text-[#17261E] transition-colors"
          >
            Why it matters
          </button>
        </div>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={onLaunch}
            className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#5FB37C] hover:bg-[#4FA36C] text-white font-semibold text-sm flex items-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-98"
          >
            <span>Launch EchoTrack</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={onLaunch}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#5FB37C] text-white text-xs font-semibold"
          >
            Launch app
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#17261E] hover:bg-[#EAF7EE] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-3 pt-3 border-t border-[#CFEBD8]/60 flex flex-col gap-2.5 pb-2 text-sm font-medium text-[#17261E]">
          <button
            type="button"
            onClick={() => scrollTo('how-it-works')}
            className="text-left px-2 py-2 rounded-lg hover:bg-[#EAF7EE]"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => scrollTo('features')}
            className="text-left px-2 py-2 rounded-lg hover:bg-[#EAF7EE]"
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => scrollTo('preview')}
            className="text-left px-2 py-2 rounded-lg hover:bg-[#EAF7EE]"
          >
            Live preview
          </button>
          <button
            type="button"
            onClick={() => scrollTo('why-it-matters')}
            className="text-left px-2 py-2 rounded-lg hover:bg-[#EAF7EE]"
          >
            Why it matters
          </button>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
