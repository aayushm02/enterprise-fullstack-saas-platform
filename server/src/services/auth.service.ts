import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { UserPayload, UserRole } from '../types';

interface UserRecord {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  fullName: string;
}

// In-memory tenant store with seed enterprise records
const USERS_STORE: UserRecord[] = [
  {
    id: 'user_admin_01',
    tenantId: 'tenant_corp_01',
    email: 'admin@enterprise.com',
    passwordHash: bcrypt.hashSync('Admin@12345', 10),
    role: 'ADMIN',
    fullName: 'Aayush Mishra (Admin)'
  },
  {
    id: 'user_eng_02',
    tenantId: 'tenant_corp_01',
    email: 'engineer@enterprise.com',
    passwordHash: bcrypt.hashSync('Engineer@12345', 10),
    role: 'ENGINEER',
    fullName: 'Dev Ops Engineer'
  },
  {
    id: 'user_view_03',
    tenantId: 'tenant_corp_01',
    email: 'viewer@enterprise.com',
    passwordHash: bcrypt.hashSync('Viewer@12345', 10),
    role: 'VIEWER',
    fullName: 'Stakeholder Analyst'
  }
];

export class AuthService {
  static async login(email: string, password: string) {
    const user = USERS_STORE.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const payload: UserPayload = {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN
    });

    return {
      token,
      user: payload
    };
  }

  static async register(tenantId: string, email: string, password: string, fullName: string, role: UserRole = 'ENGINEER') {
    const existing = USERS_STORE.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: UserRecord = {
      id: `user_${Date.now()}`,
      tenantId,
      email,
      passwordHash,
      role,
      fullName
    };

    USERS_STORE.push(newUser);

    const payload: UserPayload = {
      userId: newUser.id,
      tenantId: newUser.tenantId,
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.fullName
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN
    });

    return {
      token,
      user: payload
    };
  }
}
