import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "mysecretkey"; // ต้องตรงกับที่ใช้ใน auth.ts

// เพิ่มข้อมูลผู้ใช้ลงใน req
export interface AuthenticatedRequest extends Request {
  userId?: string;
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
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
}
