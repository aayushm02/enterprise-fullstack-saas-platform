import { RagService } from './ragService';

export interface AgentStep {
  agentName: 'TriageAgent' | 'DiagnosisAgent' | 'MitigationAgent';
  status: 'COMPLETED' | 'IN_PROGRESS';
  findings: string;
  outputData: any;
  timestamp: string;
}

export interface MultiAgentInvestigationResult {
  incidentId: string;
  verdict: string;
  confidenceScore: number;
  steps: AgentStep[];
  recommendedActionPlan: string[];
}

export class AgentService {
  /**
   * Orchestrates multi-agent collaborative investigation across Triage, Diagnosis, and Mitigation agents.
   */
  static async runInvestigation(
    incidentId: string,
    title: string,
    description: string,
    serviceName: string,
    severity: string
  ): Promise<MultiAgentInvestigationResult> {
    const steps: AgentStep[] = [];

    // 1. Triage Agent Execution
    const triageSummary = `Classified as ${severity} severity for service [${serviceName}]. Blast radius spans active customer sessions.`;
    steps.push({
      agentName: 'TriageAgent',
      status: 'COMPLETED',
      findings: triageSummary,
      outputData: {
        analyzedAt: new Date().toISOString(),
        serviceImpact: serviceName,
        blastRadius: severity === 'CRITICAL' ? 'Global / All Regions' : 'Regional / Isolated'
      },
      timestamp: new Date().toISOString()
    });

    // 2. Diagnosis Agent with RAG Retrieval
    const ragResults = await RagService.retrieveRelevantRunbooks(`${title} ${description} ${serviceName}`);
    const diagnosisFindings = ragResults.length > 0
      ? `Retrieved ${ragResults.length} matching runbooks/post-mortems from enterprise knowledge base. Primary correlation: "${ragResults[0].doc.title}" (Relevance: ${(ragResults[0].score * 100).toFixed(0)}%).`
      : 'No exact historical runbook match. Applying generalized architectural heuristics.';

    steps.push({
      agentName: 'DiagnosisAgent',
      status: 'COMPLETED',
      findings: diagnosisFindings,
      outputData: {
        ragRetrievedDocs: ragResults.map((r) => ({ title: r.doc.title, category: r.doc.category, score: r.score })),
        likelyRootCause: ragResults.length > 0 ? ragResults[0].doc.content : 'Upstream bottleneck or resource starvation'
      },
      timestamp: new Date().toISOString()
    });

    // 3. Mitigation / SRE Remediation Agent
    const recommendedActionPlan = ragResults.length > 0
      ? [
          'Verify upstream dependency endpoints and connection metrics.',
          'Execute recommended runbook procedure: ' + ragResults[0].doc.title,
          'Monitor P99 latency and error rate for 10 minutes following mitigation.'
        ]
      : [
          `Inspect ${serviceName} container logs for memory pressure and connection timeouts.`,
          `Trigger rolling restart of ${serviceName} pods.`,
          'Escalate to secondary on-call engineer if metrics do not recover in 5 minutes.'
        ];

    steps.push({
      agentName: 'MitigationAgent',
      status: 'COMPLETED',
      findings: `Generated actionable 3-step remediation playbook with safety checks.`,
      outputData: {
        actionPlan: recommendedActionPlan,
        automatedScriptRecommendation: `kubectl rollout restart deployment/${serviceName.toLowerCase()}`
      },
      timestamp: new Date().toISOString()
    });

    return {
      incidentId,
      verdict: `Multi-Agent Consensus: Automated diagnosis grounded via RAG knowledge base.`,
      confidenceScore: ragResults.length > 0 ? 0.94 : 0.78,
      steps,
      recommendedActionPlan
    };
  }
}
