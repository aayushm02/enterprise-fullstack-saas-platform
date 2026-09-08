import { Router } from 'express';
import { IncidentController } from '../controllers/incident.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticateJWT);

// All roles (ADMIN, ENGINEER, VIEWER) can list and view
router.get('/', IncidentController.list);
router.get('/:id', IncidentController.getById);

// Only ADMIN and ENGINEER can create or transition status
router.post('/', requireRole(['ADMIN', 'ENGINEER']), IncidentController.create);
router.patch('/:id/status', requireRole(['ADMIN', 'ENGINEER']), IncidentController.updateStatus);

export default router;
