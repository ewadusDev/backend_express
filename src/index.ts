import express from "express";
import authRoutes from "./routes/auth";

const app = express();
const PORT = 3000;

// Middleware สำหรับแปลง JSON request body
app.use(express.json());

// เส้นทาง Authentication เช่น /register, /login
app.use("/auth", authRoutes);

// รันเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
