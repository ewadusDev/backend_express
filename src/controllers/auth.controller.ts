import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../types/user";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const JWT_SECRET = "mysecretkey";
const users: User[] = [];

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    res.status(400).json({ message: "Username นี้ถูกใช้แล้ว" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
  };

  users.push(newUser);

  res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    return;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token });
};

export const getProfile = (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: "คุณเข้าถึงข้อมูลโปรไฟล์ได้ เพราะส่ง Token มาถูกต้องแล้ว",
    userId: req.userId,
    username: req.username,
  });
};
