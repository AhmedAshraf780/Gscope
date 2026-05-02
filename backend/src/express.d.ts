import "express";

declare global {
  namespace Express {
    interface Request {
      gym_id?: number;
    }
  }
}
