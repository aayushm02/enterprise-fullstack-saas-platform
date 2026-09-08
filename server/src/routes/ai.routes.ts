import { Router } from 'express';
import { AiController } from '../controllers/ai.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateJWT);

// Autonomous Multi-Agent Investigation pipeline
router.post('/investigate', AiController.investigateIncident);

// RAG semantic runbook query
router.post('/rag/query', AiController.queryRag);

export default router;
