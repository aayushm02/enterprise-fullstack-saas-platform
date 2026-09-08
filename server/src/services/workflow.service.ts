import { WorkflowRule } from '../types';
import { AuditService } from './audit.service';

const WORKFLOWS_STORE: WorkflowRule[] = [
  {
    id: 'wf_001',
    tenantId: 'tenant_corp_01',
    name: 'Auto-Page Senior SRE on P0/Critical',
    triggerEvent: 'INCIDENT_CREATED',
    condition: 'severity == CRITICAL',
    action: 'DISPATCH_PAGERDUTY_AND_SLACK',
    isActive: true
  },
  {
    id: 'wf_002',
    tenantId: 'tenant_corp_01',
    name: 'Auto-Acknowledge Low Priority Telemetry Warning',
    triggerEvent: 'INCIDENT_CREATED',
    condition: 'severity == LOW',
    action: 'LOG_TO_ELASTIC_AND_ACK',
    isActive: true
  }
];

export class WorkflowService {
  static async listByTenant(tenantId: string): Promise<WorkflowRule[]> {
    return WORKFLOWS_STORE.filter((w) => w.tenantId === tenantId);
  }

  static async create(
    tenantId: string,
    userId: string,
    data: { name: string; triggerEvent: string; condition: string; action: string }
  ): Promise<WorkflowRule> {
    const newWorkflow: WorkflowRule = {
      id: `wf_${Date.now()}`,
      tenantId,
      name: data.name,
      triggerEvent: data.triggerEvent,
      condition: data.condition,
      action: data.action,
      isActive: true
    };

    WORKFLOWS_STORE.push(newWorkflow);

    await AuditService.log({
      tenantId,
      userId,
      action: 'CREATE_WORKFLOW',
      resource: `Workflow:${newWorkflow.id}`,
      details: `Configured automated rule: ${newWorkflow.name}`
    });

    return newWorkflow;
  }

  static async toggleActive(tenantId: string, userId: string, workflowId: string): Promise<WorkflowRule> {
    const rule = WORKFLOWS_STORE.find((w) => w.id === workflowId && w.tenantId === tenantId);
    if (!rule) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    rule.isActive = !rule.isActive;

    await AuditService.log({
      tenantId,
      userId,
      action: 'TOGGLE_WORKFLOW',
      resource: `Workflow:${rule.id}`,
      details: `Rule status changed to: ${rule.isActive ? 'ACTIVE' : 'DISABLED'}`
    });

    return rule;
  }
}
