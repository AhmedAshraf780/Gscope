import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import jwt from "jsonwebtoken";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies["token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, config.jwt_secret);
    console.log("decoded", decoded);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
