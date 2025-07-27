export interface AuthTokenPayload {
  id: string;
  email: string;
  role: string;
  status: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export {};
