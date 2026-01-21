import type { TokenPayload } from '@/types/api';

declare global {
  namespace Express {
    interface Request {
      currentUser?: TokenPayload;
    }
  }
}

export {};
