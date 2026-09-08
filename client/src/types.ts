export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'TRIGGERED' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';
export type UserRole = 'ADMIN' | 'ENGINEER' | 'VIEWER';

export interface Incident {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  serviceName: string;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  triggerEvent: string;
  condition: string;
  action: string;
  isActive: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
}

export interface AgentStep {
  agentName: 'TriageAgent' | 'DiagnosisAgent' | 'MitigationAgent';
  status: 'COMPLETED' | 'IN_PROGRESS';
  findings: string;
  outputData: any;
  timestamp: string;
}

export interface MultiAgentResult {
  incidentId: string;
  verdict: string;
  confidenceScore: number;
  steps: AgentStep[];
  recommendedActionPlan: string[];
}
