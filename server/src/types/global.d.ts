export interface AppUser {
  id: string;
  email: string;
  role: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface User extends AppUser {}
    interface Request {
      user?: AppUser;
    }
  }
}
export {};
