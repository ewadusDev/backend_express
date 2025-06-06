import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { register, login, getProfile } from "../controllers/auth.controller";

const router = Router();

// สมัครสมาชิก
router.post("/register", register);
// เข้าสู่ระบบ
router.post("/login", login);
// เข้าถึงโปรไฟล์
router.get("/profile", authenticateToken, getProfile);
// get refrech token
router.post("/refresh-token", (req, res) => {
  const { userId, refreshToken } = req.body;
});

export default router;
