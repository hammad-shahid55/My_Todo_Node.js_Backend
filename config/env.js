import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const DB_NAME = process.env.DB_NAME;
export const COLLECTION_NAME = process.env.COLLECTION_NAME;
export const USERS_COLLECTION = process.env.USERS_COLLECTION;
export const OTP_COLLECTION = process.env.OTP_COLLECTION || "otps";
export const JWT_SECRET = process.env.JWT_SECRET;
export const CLIENT_URL = process.env.CLIENT_URL;
export const CLIENT_URL_LOCAL = process.env.CLIENT_URL_LOCAL;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const SMTP_FROM = process.env.SMTP_FROM;
