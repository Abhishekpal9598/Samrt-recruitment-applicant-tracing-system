import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Briefcase, Sun, Moon } from 'lucide-react';

export const CandidateLayout = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col transition-colors">
      {/* Candidate Portal Top Navigation */}
      <header className="sticky top-0 z-40 h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center text-white font-bold shadow-subtle">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white">
              Smart ATS Careers
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-4">
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `text-xs sm:text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`
              }
            >
              Explore Openings
            </NavLink>
            <NavLink
              to="/portal"
              className={({ isActive }) =>
                `text-xs sm:text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`
              }
            >
              My Applications
            </NavLink>

            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-md text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>

      {/* Clean Enterprise Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <p>© 2026 Smart Recruitment & ATS. Enterprise Recruitment Engine.</p>
          <div className="flex items-center gap-4">
            <Link to="/hr/pipeline" className="hover:text-primary-600 dark:hover:text-primary-400">
              Talent Workspace Switch
            </Link>
            <Link to="/admin" className="hover:text-primary-600 dark:hover:text-primary-400">
              Admin Console
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CandidateLayout;
