import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/jwt.config";

// เพิ่มข้อมูลผู้ใช้ลงใน req
export interface AuthenticatedRequest extends Request {
  userId?: string;
  username?: string;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // ดึง token จาก "Bearer xxx"

  if (!token) {
    res.status(401).json({ message: "ไม่ได้ส่ง Token มาด้วย" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
    };
    req.userId = payload.userId;
    req.username = payload.username;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
}
