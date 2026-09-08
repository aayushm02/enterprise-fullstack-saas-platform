import { Incident, IncidentSeverity, IncidentStatus } from '../types';
import { SocketServer } from '../websocket/socketServer';
import { AuditService } from './audit.service';

const INCIDENTS_STORE: Incident[] = [
  {
    id: 'inc_101',
    tenantId: 'tenant_corp_01',
    title: 'High Latency Detected in Payment Gateway API',
    description: 'P99 response times exceeded 2500ms on /api/v1/payments webhook',
    severity: 'CRITICAL',
    status: 'INVESTIGATING',
    serviceName: 'PaymentService',
    assigneeId: 'user_eng_02',
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date()
  },
  {
    id: 'inc_102',
    tenantId: 'tenant_corp_01',
    title: 'Database Connection Pool Exhaustion on Replica 2',
    description: 'PostgreSQL read-replica connections saturated at 98%',
    severity: 'HIGH',
    status: 'ACKNOWLEDGED',
    serviceName: 'DatabaseCluster',
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date()
  },
  {
    id: 'inc_103',
    tenantId: 'tenant_corp_01',
    title: 'Kafka Consumer Group Rebalance Timeout',
    description: 'Analytics telemetry consumer stalled for 45 seconds',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    serviceName: 'StreamConsumer',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date()
  }
];

export class IncidentService {
  static async listByTenant(tenantId: string, severity?: IncidentSeverity, status?: IncidentStatus): Promise<Incident[]> {
    return INCIDENTS_STORE.filter((inc) => {
      if (inc.tenantId !== tenantId) return false;
      if (severity && inc.severity !== severity) return false;
      if (status && inc.status !== status) return false;
      return true;
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async getById(tenantId: string, incidentId: string): Promise<Incident | undefined> {
    return INCIDENTS_STORE.find((inc) => inc.id === incidentId && inc.tenantId === tenantId);
  }

  static async create(
    tenantId: string,
    userId: string,
    data: { title: string; description: string; severity: IncidentSeverity; serviceName: string }
  ): Promise<Incident> {
    const newIncident: Incident = {
      id: `inc_${Date.now()}`,
      tenantId,
      title: data.title,
      description: data.description,
      severity: data.severity,
      status: 'TRIGGERED',
      serviceName: data.serviceName,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    INCIDENTS_STORE.unshift(newIncident);

    // Broadcast real-time event to tenant room
    SocketServer.emitToTenant(tenantId, 'INCIDENT_CREATED', newIncident);

    // Record audit trail
    await AuditService.log({
      tenantId,
      userId,
      action: 'CREATE_INCIDENT',
      resource: `Incident:${newIncident.id}`,
      details: `Created ${newIncident.severity} incident for ${newIncident.serviceName}`
    });

    return newIncident;
  }

  static async updateStatus(
    tenantId: string,
    userId: string,
    incidentId: string,
    status: IncidentStatus,
    assigneeId?: string
  ): Promise<Incident> {
    const incident = await this.getById(tenantId, incidentId);
    if (!incident) {
      throw new Error(`Incident with id ${incidentId} not found`);
    }

    const previousStatus = incident.status;
    incident.status = status;
    incident.updatedAt = new Date();
    if (assigneeId) incident.assigneeId = assigneeId;

    // Broadcast real-time update
    SocketServer.emitToTenant(tenantId, 'INCIDENT_UPDATED', incident);

    // Record audit trail
    await AuditService.log({
      tenantId,
      userId,
      action: 'UPDATE_INCIDENT_STATUS',
      resource: `Incident:${incident.id}`,
      details: `Transitioned status from ${previousStatus} -> ${status}`
    });

    return incident;
  }
}
