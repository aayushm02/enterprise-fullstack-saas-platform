import React from 'react';
import { Shield, Radio, Cpu, FileText, Bell } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: 'incidents' | 'workflows' | 'audit';
  setActiveTab: (tab: 'incidents' | 'workflows' | 'audit') => void;
  userRole: UserRole;
  userEmail: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  userEmail,
  onLogout
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                NexusPulse
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                Enterprise AI
              </span>
            </div>
            <p className="text-xs text-slate-400">Incident Ops & Multi-Agent RAG</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('incidents')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
              activeTab === 'incidents'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Incidents</span>
          </button>

          <button
            onClick={() => setActiveTab('workflows')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
              activeTab === 'workflows'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Workflows</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>
        </nav>

        {/* User Badge & Logout */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-200">{userEmail}</span>
            <div className="flex items-center justify-end space-x-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-mono text-emerald-400 uppercase">{userRole}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-red-950/40 hover:border-red-800 hover:text-red-300 text-slate-300 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};
