import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { WorkflowService } from '../services/workflow.service';

export class WorkflowController {
  static async list(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const workflows = await WorkflowService.listByTenant(tenantId);
      return res.status(200).json({ success: true, count: workflows.length, data: workflows });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const userId = req.user!.userId;
      const { name, triggerEvent, condition, action } = req.body;

      if (!name || !triggerEvent || !condition || !action) {
        return res.status(400).json({ success: false, error: 'Missing required workflow rule fields' });
      }

      const workflow = await WorkflowService.create(tenantId, userId, {
        name,
        triggerEvent,
        condition,
        action
      });

      return res.status(201).json({ success: true, data: workflow });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async toggleActive(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const userId = req.user!.userId;
      const { id } = req.params;

      const updated = await WorkflowService.toggleActive(tenantId, userId, id);
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}
