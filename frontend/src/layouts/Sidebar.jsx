import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Briefcase,
  Users,
  GitBranch,
  Calendar,
  FileCheck,
  UserCheck,
  Shield,
  Layers,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

export const Sidebar = ({
  role = 'HR',
  isMobileOpen = false,
  onCloseMobile = () => {},
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const hrNavGroups = [
    {
      group: 'Talent Acquisition',
      items: [
        { label: 'Requisitions', to: '/hr/jobs', icon: Briefcase },
        { label: 'Candidate Pipeline', to: '/hr/pipeline', icon: GitBranch },
        { label: 'Candidates', to: '/hr/candidates', icon: Users },
        { label: 'Interviews', to: '/hr/interviews', icon: Calendar },
      ],
    },
    {
      group: 'Workforce',
      items: [
        { label: 'Offer Letters', to: '/hr/offers', icon: FileCheck },
        { label: 'Onboarding', to: '/hr/onboarding', icon: UserCheck },
      ],
    },
    {
      group: 'Administration',
      items: [
        { label: 'System Overview', to: '/admin', icon: Layers },
        { label: 'User Provisioning', to: '/admin/users', icon: Shield },
        { label: 'Settings', to: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const adminNavGroups = [
    {
      group: 'Governance & Security',
      items: [
        { label: 'Admin Dashboard', to: '/admin', icon: Layers },
        { label: 'User Provisioning', to: '/admin/users', icon: Shield },
        { label: 'Audit Trail Logs', to: '/admin/audit', icon: FileCheck },
        { label: 'Global Settings', to: '/admin/settings', icon: Settings },
      ],
    },
    {
      group: 'Operations Switch',
      items: [
        { label: 'Talent Workspace', to: '/hr/pipeline', icon: GitBranch },
        { label: 'Public Career Board', to: '/jobs', icon: Briefcase },
      ],
    },
  ];

  const navGroups = role === 'ADMIN' ? adminNavGroups : hrNavGroups;

  const sidebarContent = (
    <aside
      className={`h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transition-all duration-200 select-none ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx}>
            {!isCollapsed ? (
              <h4 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider px-2.5 mb-2">
                {group.group}
              </h4>
            ) : (
              <div className="h-px bg-neutral-200 dark:bg-neutral-800 mx-2 mb-2" />
            )}
            <nav className="space-y-1">
              {group.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={idx}
                    to={item.to}
                    end
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 font-semibold shadow-subtle'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      } ${isCollapsed ? 'justify-center px-0' : ''}`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer Collapse Toggle */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 hidden md:block">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-1.5 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Collapse view</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block h-[calc(100vh-3.5rem)] sticky top-14">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-neutral-900">
            <div className="absolute top-3 right-3">
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
