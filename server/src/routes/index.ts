import { Router } from 'express';
import authRoutes from './auth.routes';
import incidentRoutes from './incident.routes';
import workflowRoutes from './workflow.routes';
import auditRoutes from './audit.routes';
import aiRoutes from './ai.routes';

const apiRouter = Router();

// Liveness & Readiness probe
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'NexusPulse API Gateway',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/incidents', incidentRoutes);
apiRouter.use('/workflows', workflowRoutes);
apiRouter.use('/audit', auditRoutes);
apiRouter.use('/ai', aiRoutes);

export default apiRouter;
