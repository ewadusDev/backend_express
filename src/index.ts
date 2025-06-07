import express from "express";
import authRoutes from "./routes/auth.route";

const app = express();
const PORT = 3000;

// Middleware สำหรับแปลง JSON request body
app.use(express.json());

// เส้นทาง Authentication เช่น auth/register, auth/login
app.use("/auth", authRoutes);

app.use("/", (req, res) => {
  const { url, method } = req;
  if (url === "/" || url === "/home") {
    res.end("<h1>Welcome to backend</h1>");
  }
});

// รันเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

export default app;
