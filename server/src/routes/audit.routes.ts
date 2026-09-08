import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticateJWT);

// Only ADMIN and ENGINEER can view audit logs
router.get('/', requireRole(['ADMIN', 'ENGINEER']), AuditController.list);

export default router;
