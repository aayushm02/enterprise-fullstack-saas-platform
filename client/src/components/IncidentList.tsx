import React, { useState } from 'react';
import { Bot, AlertTriangle, CheckCircle, Clock, Plus } from 'lucide-react';
import { Incident, IncidentSeverity, IncidentStatus } from '../types';

interface IncidentListProps {
  incidents: Incident[];
  onStatusChange: (id: string, status: IncidentStatus) => void;
  onInvestigate: (incident: Incident) => void;
  onCreateIncident: (incident: { title: string; description: string; severity: IncidentSeverity; serviceName: string }) => void;
  canMutate: boolean;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  onStatusChange,
  onInvestigate,
  onCreateIncident,
  canMutate
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newService, setNewService] = useState('');
  const [newSeverity, setNewSeverity] = useState<IncidentSeverity>('HIGH');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newService) return;
    onCreateIncident({
      title: newTitle,
      serviceName: newService,
      severity: newSeverity,
      description: newDesc
    });
    setNewTitle('');
    setNewService('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  const severityBadge = (sev: IncidentSeverity) => {
    const styles = {
      CRITICAL: 'bg-red-950/60 text-red-400 border-red-800',
      HIGH: 'bg-amber-950/60 text-amber-400 border-amber-800',
      MEDIUM: 'bg-yellow-950/60 text-yellow-400 border-yellow-800',
      LOW: 'bg-blue-950/60 text-blue-400 border-blue-800'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${styles[sev]}`}>
        {sev}
      </span>
    );
  };

  const statusBadge = (status: IncidentStatus) => {
    const styles = {
      TRIGGERED: 'bg-rose-950/50 text-rose-300 border-rose-800',
      ACKNOWLEDGED: 'bg-yellow-950/50 text-yellow-300 border-yellow-800',
      INVESTIGATING: 'bg-indigo-950/50 text-indigo-300 border-indigo-800',
      RESOLVED: 'bg-emerald-950/50 text-emerald-300 border-emerald-800'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Active Incident Feed
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </h2>
          <p className="text-xs text-slate-400">Real-time WebSocket telemetry & service monitoring</p>
        </div>

        {canMutate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Trigger Incident</span>
          </button>
        )}
      </div>

      {/* Incidents Table / Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 uppercase font-semibold text-slate-400 text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Service & Incident Title</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-5 py-4 whitespace-nowrap">{severityBadge(inc.severity)}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-100">{inc.title}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-cyan-400">[{inc.serviceName}]</span>
                      <span className="truncate max-w-md">{inc.description}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {canMutate ? (
                      <select
                        value={inc.status}
                        onChange={(e) => onStatusChange(inc.id, e.target.value as IncidentStatus)}
                        className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="TRIGGERED">TRIGGERED</option>
                        <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                        <option value="INVESTIGATING">INVESTIGATING</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    ) : (
                      statusBadge(inc.status)
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-400">
                    {new Date(inc.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right space-x-2">
                    <button
                      onClick={() => onInvestigate(inc)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-sm transition"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Investigate AI</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trigger Incident Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Trigger New Incident</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Memory saturation on worker node"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Service Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PaymentGateway"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as IncidentSeverity)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Stack trace, symptoms, or error details..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md"
                >
                  Broadcast Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
