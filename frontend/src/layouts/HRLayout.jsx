import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export const HRLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col transition-colors">
      <Header
        onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
        workspaceTitle="Talent Workspace"
      />
      <div className="flex-1 flex">
        <Sidebar
          role="HR"
          isMobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HRLayout;
