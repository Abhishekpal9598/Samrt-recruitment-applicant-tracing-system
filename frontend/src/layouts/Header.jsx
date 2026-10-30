import React from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Search,
  Bell,
  Menu,
  Briefcase,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = ({ onToggleMobileSidebar, workspaceTitle = 'Enterprise ATS' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu + Branding */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="md:hidden p-1.5 rounded-md text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center text-white font-bold shadow-subtle">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white">
                  Smart ATS
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  {workspaceTitle}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Quick Search Command Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              readOnly
              placeholder="Search jobs, candidates, requisitions... (Cmd+K)"
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-300 placeholder-neutral-400 cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-md text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle light and dark theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 rounded-md text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-600"></span>
          </button>

          <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-1 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 font-semibold text-xs border border-neutral-300 dark:border-neutral-600">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
                Staff User
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Enterprise Workspace
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
