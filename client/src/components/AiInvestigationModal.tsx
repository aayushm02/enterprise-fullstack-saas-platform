import React from 'react';
import { Bot, Sparkles, CheckCircle2, ShieldAlert, Terminal, X } from 'lucide-react';
import { Incident, MultiAgentResult } from '../types';

interface AiInvestigationModalProps {
  incident: Incident | null;
  result: MultiAgentResult | null;
  isLoading: boolean;
  onClose: () => void;
}

export const AiInvestigationModal: React.FC<AiInvestigationModalProps> = ({
  incident,
  result,
  isLoading,
  onClose
}) => {
  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <Bot className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                NexusAI Autonomous Multi-Agent Investigation
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                  RAG-Enhanced
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Target: [{incident.serviceName}] {incident.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-300">
                Orchestrating Triage, Diagnosis, and Mitigation Agents...
              </p>
              <span className="text-xs text-slate-500">Querying semantic vector runbooks via RAG...</span>
            </div>
          ) : result ? (
            <>
              {/* Verdict Summary Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-800/40 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Agent Consensus Verdict</span>
                  </div>
                  <p className="text-sm font-medium text-slate-100">{result.verdict}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Confidence</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {(result.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Multi-Agent Sequential Timeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Autonomous Multi-Agent Trace
                </h3>

                <div className="space-y-3">
                  {result.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start space-x-3"
                    >
                      <div className="mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex-1 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">🤖 {step.agentName}</span>
                          <span className="text-[10px] text-slate-500">{new Date(step.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-300">{step.findings}</p>
                        {step.outputData?.likelyRootCause && (
                          <div className="mt-2 p-2 bg-slate-900/80 rounded border border-slate-800 text-[11px] text-slate-400 font-mono">
                            <strong className="text-indigo-300">RAG Grounded Ground Truth:</strong> {step.outputData.likelyRootCause}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mitigation & Playbook Recommendations */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Actionable SRE Remediation Playbook</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
                  {result.recommendedActionPlan.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>

                <div className="mt-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center space-x-2 text-xs font-mono text-cyan-300">
                  <Terminal className="w-4 h-4 text-slate-400" />
                  <span>kubectl rollout restart deployment/{incident.serviceName.toLowerCase()}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-slate-500 py-8">No investigation result available.</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
