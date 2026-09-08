import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Navbar } from './components/Navbar';
import { IncidentList } from './components/IncidentList';
import { WorkflowList } from './components/WorkflowList';
import { AuditLogView } from './components/AuditLogView';
import { AiInvestigationModal } from './components/AiInvestigationModal';
import { Incident, WorkflowRule, AuditLogEntry, UserRole, IncidentSeverity, IncidentStatus, MultiAgentResult } from './types';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('nexus_token'));
  const [userRole, setUserRole] = useState<UserRole>((localStorage.getItem('nexus_role') as UserRole) || 'ADMIN');
  const [userEmail, setUserEmail] = useState<string>(localStorage.getItem('nexus_email') || 'admin@enterprise.com');
  const [activeTab, setActiveTab] = useState<'incidents' | 'workflows' | 'audit'>('incidents');

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // AI Modal State
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [aiResult, setAiResult] = useState<MultiAgentResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Quick Login state for unauthenticated users
  const [loginEmail, setLoginEmail] = useState('admin@enterprise.com');
  const [loginPassword, setLoginPassword] = useState('Admin@12345');
  const [loginError, setLoginError] = useState('');

  // 1. WebSocket Live Sync
  useEffect(() => {
    if (!token) return;

    const socket: Socket = io('/', {
      auth: { token: `Bearer ${token}` }
    });

    socket.on('INCIDENT_CREATED', (newInc: Incident) => {
      setIncidents((prev) => [newInc, ...prev]);
    });

    socket.on('INCIDENT_UPDATED', (updatedInc: Incident) => {
      setIncidents((prev) => prev.map((inc) => (inc.id === updatedInc.id ? updatedInc : inc)));
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // 2. Fetch Initial Data
  const fetchData = async () => {
    if (!token) return;

    try {
      const incRes = await fetch('/api/v1/incidents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const incData = await incRes.json();
      if (incData.success) setIncidents(incData.data);

      const wfRes = await fetch('/api/v1/workflows', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const wfData = await wfRes.json();
      if (wfData.success) setWorkflows(wfData.data);

      if (userRole === 'ADMIN' || userRole === 'ENGINEER') {
        const audRes = await fetch('/api/v1/audit', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const audData = await audRes.json();
        if (audData.success) setAuditLogs(audData.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, userRole]);

  // 3. Actions
  const handleLogin = async (emailToUse?: string, passToUse?: string) => {
    setLoginError('');
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToUse || loginEmail,
          password: passToUse || loginPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.data.token);
        setUserRole(data.data.user.role);
        setUserEmail(data.data.user.email);
        localStorage.setItem('nexus_token', data.data.token);
        localStorage.setItem('nexus_role', data.data.user.role);
        localStorage.setItem('nexus_email', data.data.user.email);
      } else {
        setLoginError(data.error);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
  };

  const handleStatusChange = async (id: string, status: IncidentStatus) => {
    try {
      await fetch(`/api/v1/incidents/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateIncident = async (payload: {
    title: string;
    description: string;
    severity: IncidentSeverity;
    serviceName: string;
  }) => {
    try {
      await fetch('/api/v1/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleWorkflow = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/workflows/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setWorkflows((prev) => prev.map((w) => (w.id === id ? data.data : w)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInvestigateAi = async (incident: Incident) => {
    setSelectedIncident(incident);
    setAiResult(null);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/v1/ai/investigate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ incidentId: incident.id })
      });
      const data = await res.json();
      if (data.success) {
        setAiResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              NexusPulse Enterprise
            </h1>
            <p className="text-xs text-slate-400">Sign in to your multi-tenant workspace</p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs text-center">
              {loginError}
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Corporate Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => handleLogin()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md shadow-indigo-600/30 transition"
            >
              Sign In
            </button>
          </div>

          {/* 1-Click Quick Demo Presets */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-[11px] text-slate-500 text-center font-medium">Quick Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLogin('admin@enterprise.com', 'Admin@12345')}
                className="p-2 rounded bg-slate-800/80 hover:bg-slate-800 text-[11px] text-indigo-300 border border-slate-700/60 transition text-center"
              >
                Login as <strong>Admin</strong>
              </button>
              <button
                onClick={() => handleLogin('engineer@enterprise.com', 'Engineer@12345')}
                className="p-2 rounded bg-slate-800/80 hover:bg-slate-800 text-[11px] text-cyan-300 border border-slate-700/60 transition text-center"
              >
                Login as <strong>Engineer</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'incidents' && (
          <IncidentList
            incidents={incidents}
            onStatusChange={handleStatusChange}
            onInvestigate={handleInvestigateAi}
            onCreateIncident={handleCreateIncident}
            canMutate={userRole === 'ADMIN' || userRole === 'ENGINEER'}
          />
        )}

        {activeTab === 'workflows' && (
          <WorkflowList
            workflows={workflows}
            onToggle={handleToggleWorkflow}
            canManage={userRole === 'ADMIN'}
          />
        )}

        {activeTab === 'audit' && <AuditLogView logs={auditLogs} />}
      </main>

      <AiInvestigationModal
        incident={selectedIncident}
        result={aiResult}
        isLoading={isAiLoading}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
}
