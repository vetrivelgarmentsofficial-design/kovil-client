import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { BottomNav } from '../components/BottomNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100/70 sm:bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <div className="flex-1 flex max-w-6xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 px-3.5 py-4 sm:p-6 pb-[calc(env(safe-area-inset-bottom,0px)+6.5rem)] sm:pb-8 w-full max-w-3xl mx-auto">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
};
