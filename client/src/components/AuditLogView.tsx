import React from 'react';
import { FileText, Shield } from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Compliance & Security Audit Trail
          </h2>
          <p className="text-xs text-slate-400">Immutable audit log of all system mutations and actions</p>
        </div>
        <div className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
          <Shield className="w-3.5 h-3.5" />
          <span>SOC-2 Ready</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 uppercase font-semibold text-slate-400 text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Resource</th>
                <th className="px-5 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-5 py-3 whitespace-nowrap text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-cyan-300">{log.resource}</td>
                  <td className="px-5 py-3 text-slate-300 font-sans">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
