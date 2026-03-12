export type UserRole = 'user' | 'admin';

export type BaseTokenPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

export type UserTokenPayload = BaseTokenPayload;

export const ROLE_KEY = 'roles';
export const REFRESH_KEY = 'refresh_required';
