import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { AgentService } from '../ai/agentService';
import { RagService } from '../ai/ragService';
import { IncidentService } from '../services/incident.service';

export class AiController {
  /**
   * Triggers the Multi-Agent autonomous investigation workflow for an incident.
   */
  static async investigateIncident(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const { incidentId } = req.body;

      if (!incidentId) {
        return res.status(400).json({ success: false, error: 'incidentId is required' });
      }

      const incident = await IncidentService.getById(tenantId, incidentId);
      if (!incident) {
        return res.status(404).json({ success: false, error: 'Incident not found' });
      }

      const result = await AgentService.runInvestigation(
        incident.id,
        incident.title,
        incident.description,
        incident.serviceName,
        incident.severity
      );

      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Queries the RAG knowledge base for matching runbooks and post-mortems.
   */
  static async queryRag(req: AuthenticatedRequest, res: Response) {
    try {
      const { query, topK } = req.body;
      if (!query) {
        return res.status(400).json({ success: false, error: 'query string is required' });
      }

      const results = await RagService.retrieveRelevantRunbooks(query, topK || 3);
      return res.status(200).json({ success: true, count: results.length, data: results });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
