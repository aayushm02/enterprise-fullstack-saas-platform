import { Request } from 'express';

export type UserRole = 'ADMIN' | 'ENGINEER' | 'VIEWER';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 'TRIGGERED' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';

export interface UserPayload {
  userId: string;
  tenantId: string;
  email: string;
  role: UserRole;
  fullName: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface Tenant {
  id: string;
  name: string;
  plan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  createdAt: Date;
}

export interface Incident {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  serviceName: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowRule {
  id: string;
  tenantId: string;
  name: string;
  triggerEvent: string;
  condition: string;
  action: string;
  isActive: boolean;
}

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  resource: string;
  details: string;
  ipAddress?: string;
  timestamp: Date;
}
