import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../types/user";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { users } from "../data/user.data";
import {
  JWT_SECRET,
  REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../config/jwt.config";
import { store } from "../data/token.data";

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

  const accesstoken = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, username: user.username },
    REFRESH_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    }
  );

  store.refreshTokens.push(refreshToken);

  res
    .status(200)
    .json({ accesstoken, refreshToken, message: "เข้าสู่ระบบสำเร็จ" });
};

export const refreshAccessToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !store.refreshTokens.includes(refreshToken)) {
    res.status(403).json({ message: "ไม่มี refresh token หรือไม่ถูกต้อง" });
    return;
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as {
      userId: string;
    };
    const newAccessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "refresh token หมดอายุหรือไม่ถูกต้อง" });
    return;
  }
};

export const getProfile = (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    message: "คุณเข้าถึงข้อมูลโปรไฟล์ได้ เพราะส่ง Token มาถูกต้องแล้ว",
    userId: req.userId,
    username: req.username,
  });
};

export const logout = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "ต้องส่ง refreshToken มาด้วย" });
    return;
  }
  if (!store.refreshTokens.includes(refreshToken)) {
    res.status(403).json({ message: "refresh token ไม่ถูกต้อง" });
    return;
  }

  const newArray = store.refreshTokens.filter(
    (token) => token !== refreshToken
  );
  store.refreshTokens = newArray;
  res.status(200).json({ message: "ออกจากระบบสำเร็จ" });
  return;
};
