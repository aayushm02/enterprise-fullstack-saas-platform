import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
      }

      const result = await AuthService.login(email, password);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(401).json({ success: false, error: error.message });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { tenantId, email, password, fullName, role } = req.body;
      if (!tenantId || !email || !password || !fullName) {
        return res.status(400).json({ success: false, error: 'Missing required registration fields' });
      }

      const result = await AuthService.register(tenantId, email, password, fullName, role);
      return res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}
