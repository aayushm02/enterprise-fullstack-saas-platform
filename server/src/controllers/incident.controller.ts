import { Response } from 'express';
import { AuthenticatedRequest, IncidentSeverity, IncidentStatus } from '../types';
import { IncidentService } from '../services/incident.service';

export class IncidentController {
  static async list(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const { severity, status } = req.query;

      const incidents = await IncidentService.listByTenant(
        tenantId,
        severity as IncidentSeverity,
        status as IncidentStatus
      );

      return res.status(200).json({ success: true, count: incidents.length, data: incidents });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const { id } = req.params;

      const incident = await IncidentService.getById(tenantId, id);
      if (!incident) {
        return res.status(404).json({ success: false, error: 'Incident not found' });
      }

      return res.status(200).json({ success: true, data: incident });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const userId = req.user!.userId;
      const { title, description, severity, serviceName } = req.body;

      if (!title || !severity || !serviceName) {
        return res.status(400).json({ success: false, error: 'title, severity, and serviceName are required' });
      }

      const incident = await IncidentService.create(tenantId, userId, {
        title,
        description: description || '',
        severity,
        serviceName
      });

      return res.status(201).json({ success: true, data: incident });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const userId = req.user!.userId;
      const { id } = req.params;
      const { status, assigneeId } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, error: 'status is required' });
      }

      const updated = await IncidentService.updateStatus(tenantId, userId, id, status, assigneeId);
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}
