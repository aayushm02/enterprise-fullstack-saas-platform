import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { AuditService } from '../services/audit.service';

export class AuditController {
  static async list(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const logs = await AuditService.listByTenant(tenantId);
      return res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
