import { Router } from 'express';
import { WorkflowController } from '../controllers/workflow.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', WorkflowController.list);

// Only ADMIN can configure or toggle workflows
router.post('/', requireRole(['ADMIN']), WorkflowController.create);
router.patch('/:id/toggle', requireRole(['ADMIN']), WorkflowController.toggleActive);

export default router;
