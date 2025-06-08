import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
export const REFRESH_SECRET = process.env.REFRESH_SECRET || "refreshsecretkey";

export const ACCESS_TOKEN_EXPIRES_IN =
  process.env.ACCESS_TOKEN_EXPIRES_IN || 24 * 60 * 60; // 24hrs
export const REFRESH_TOKEN_EXPIRES_IN =
  process.env.REFRESH_TOKEN_EXPIRES_IN || 7 * 24 * 60 * 60; // 7 days
