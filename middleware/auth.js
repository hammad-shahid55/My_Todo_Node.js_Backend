import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const verifyToken = (req, res, next) => {
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.slice(7);
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};
