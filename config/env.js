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
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
