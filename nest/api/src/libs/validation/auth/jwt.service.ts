import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { UserRole } from './types';

export type TokenPayload = {
  userId: string;
  role: UserRole;
  email: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
};

@Injectable()
export class JwtService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'task_manager_jwt_secret';
  private readonly ACCESS_TOKEN_EXPIRES_IN = 15 * 60 + 10000000;
  private readonly REFRESH_TOKEN_EXPIRES_IN = 30 * 24 * 60 * 60 + 10000000;

  generateTokens(
    userId: string,
    role: UserRole,
    email: string,
  ): { access_token: string; refresh_token: string } {
    const now = Math.floor(Date.now() / 1000);

    const accessPayload = {
      userId,
      role,
      email,
      type: 'access',
      iat: now,
      exp: now + this.ACCESS_TOKEN_EXPIRES_IN,
    };
    const access_token = this.createToken(accessPayload);

    const refreshPayload = {
      userId,
      role,
      email,
      type: 'refresh',
      iat: now,
      exp: now + this.REFRESH_TOKEN_EXPIRES_IN,
    };
    const refresh_token = this.createToken(refreshPayload);

    return { access_token, refresh_token };
  }

  signToken(payload: { userId: string; email: string }): string {
    const { access_token } = this.generateTokens(payload.userId, 'user', payload.email);
    return access_token;
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      const payloadB64 = parts[1];
      const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
      const payload = JSON.parse(payloadJson);
      return payload;
    } catch (error) {
      return null;
    }
  }

  private createToken(payload: object): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = this.sign(`${headerB64}.${payloadB64}`);
    return `${headerB64}.${payloadB64}.${signature}`;
  }

  private sign(data: string): string {
    return createHash('sha256')
      .update(data + this.JWT_SECRET)
      .digest('base64url');
  }

  generateSecureToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  extractRole(token: string): UserRole | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf-8');
      return JSON.parse(payloadJson).role as UserRole;
    } catch {
      return null;
    }
  }

  extractUserId(token: string): string | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf-8');
      return JSON.parse(payloadJson).userId;
    } catch {
      return null;
    }
  }
}
