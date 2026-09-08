import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authRateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/login', authRateLimiter, AuthController.login);
router.post('/register', authRateLimiter, AuthController.register);

export default router;
