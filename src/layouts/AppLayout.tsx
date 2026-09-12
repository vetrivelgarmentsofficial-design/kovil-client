import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { BottomNav } from '../components/BottomNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />
      <div className="flex-1 flex max-w-6xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 pb-24 sm:pb-8 w-full max-w-3xl mx-auto">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
};
