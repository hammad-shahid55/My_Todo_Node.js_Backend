import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { connection } from "../dbconfig.js";
import { USERS_COLLECTION, JWT_SECRET } from "../config/env.js";

const router = Router();

router.post("/signup", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Full name, email, and password are required" });
        }

        if (!email.includes("@") || password.length < 6) {
            return res.status(400).json({ message: "Invalid email or weak password" });
        }

        const db = await connection();
        const collection = db.collection(USERS_COLLECTION);

        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await collection.insertOne({
            fullName,
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

        const token = jwt.sign(
            { id: result.insertedId, email, fullName },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: "User signed up successfully",
            token,
            userId: result.insertedId,
            fullName
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const db = await connection();
        const collection = db.collection(USERS_COLLECTION);

        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, fullName: user.fullName },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            userId: user._id,
            fullName: user.fullName,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
});

export default router;
