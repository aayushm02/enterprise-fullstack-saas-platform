import { AuditLogEntry } from '../types';

const AUDIT_STORE: AuditLogEntry[] = [
  {
    id: 'aud_001',
    tenantId: 'tenant_corp_01',
    userId: 'user_admin_01',
    action: 'INIT_PLATFORM',
    resource: 'System',
    details: 'Tenant workspace initialized with Enterprise tier policies',
    timestamp: new Date(Date.now() - 86400000)
  }
];

export class AuditService {
  static async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
    const record: AuditLogEntry = {
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date(),
      ...entry
    };

    AUDIT_STORE.unshift(record);
    return record;
  }

  static async listByTenant(tenantId: string, limit = 50): Promise<AuditLogEntry[]> {
    return AUDIT_STORE
      .filter((a) => a.tenantId === tenantId)
      .slice(0, limit);
  }
}
