import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Requires one of [${allowedRoles.join(', ')}] role. Current role: ${req.user.role}`
      });
    }

    next();
  };
};
