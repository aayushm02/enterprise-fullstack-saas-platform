import React from 'react';
import { Cpu, Power, Zap } from 'lucide-react';
import { WorkflowRule } from '../types';

interface WorkflowListProps {
  workflows: WorkflowRule[];
  onToggle: (id: string) => void;
  canManage: boolean;
}

export const WorkflowList: React.FC<WorkflowListProps> = ({ workflows, onToggle, canManage }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Automated Incident Workflows
          </h2>
          <p className="text-xs text-slate-400">Trigger-condition-action event pipeline engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className={`p-5 rounded-xl border transition ${
              wf.isActive
                ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-600/40'
                : 'bg-slate-950/40 border-slate-800/40 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-950 text-indigo-400 rounded-lg border border-indigo-800/40">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{wf.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400">ID: {wf.id}</span>
                </div>
              </div>

              {canManage && (
                <button
                  onClick={() => onToggle(wf.id)}
                  className={`p-1.5 rounded-lg border transition ${
                    wf.isActive
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Power className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="p-2 bg-slate-950 rounded border border-slate-800/80 font-mono text-[11px]">
                <span className="text-purple-400 font-bold">WHEN:</span> {wf.triggerEvent}
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800/80 font-mono text-[11px]">
                <span className="text-cyan-400 font-bold">IF:</span> {wf.condition}
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800/80 font-mono text-[11px]">
                <span className="text-emerald-400 font-bold">THEN:</span> {wf.action}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
