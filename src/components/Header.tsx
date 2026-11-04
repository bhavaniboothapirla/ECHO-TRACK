/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, Moon, Settings, Sun } from 'lucide-react';
import { UserSettings } from '../types';

interface HeaderProps {
  settings: UserSettings;
  onOpenSettings: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onToggleTheme,
  isDark,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 py-4 px-4 sm:px-6 border-b border-[#D6DFD1] dark:border-[#24352A] bg-[#E8EDE4]/80 dark:bg-[#121915]/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      {/* Brand Zone */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#2F6B43] dark:bg-[#3FA066] flex items-center justify-center text-[#E8EDE4] dark:text-[#121915] shadow-xs">
          <Leaf className="w-5 h-5" strokeWidth={2.2} />
        </div>
        <div>
          <span className="font-display text-xl font-bold tracking-tight text-[#17261E] dark:text-[#F0F5F1]">
            EchoTrack
          </span>
          <span className="hidden sm:inline-block ml-2 text-xs text-[#526859] dark:text-[#8FA596] font-medium">
            Daily sustainability logger
          </span>
        </div>
      </div>

      {/* Action Zone */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#3D5244] dark:text-[#A3B8AA] hover:bg-[#DDE5D8] dark:hover:bg-[#1C2C22] transition-colors"
          title={isDark ? 'Light theme' : 'Dark theme'}
        >
          {isDark ? <Sun className="w-5 h-5 text-[#E5B54F]" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Open settings"
          className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#3D5244] dark:text-[#A3B8AA] hover:bg-[#DDE5D8] dark:hover:bg-[#1C2C22] transition-colors"
          title="Settings & Export"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
