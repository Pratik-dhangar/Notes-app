// This file extends the Express Request type globally
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
    };
  }
}