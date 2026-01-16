import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { connection } from "../dbconfig.js";
import { USERS_COLLECTION, OTP_COLLECTION, JWT_SECRET } from "../config/env.js";

const router = Router();

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

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
        const usersCollection = db.collection(USERS_COLLECTION);
        const otpCollection = db.collection(OTP_COLLECTION);

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await otpCollection.deleteMany({ email });

        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const otp = generateOTP();

        await otpCollection.insertOne({
            email,
            otp,
            fullName,
            password: hashedPassword,
            expiresAt: otpExpiry,
            createdAt: new Date()
        });

        res.status(200).json({
            success: true,
            message: "OTP generated successfully",
            email,
            otp
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const db = await connection();
        const usersCollection = db.collection(USERS_COLLECTION);
        const otpCollection = db.collection(OTP_COLLECTION);

        const otpRecord = await otpCollection.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (new Date() > otpRecord.expiresAt) {
            await otpCollection.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        const result = await usersCollection.insertOne({
            fullName: otpRecord.fullName,
            email: otpRecord.email,
            password: otpRecord.password,
            createdAt: new Date()
        });

        await otpCollection.deleteOne({ _id: otpRecord._id });

        const token = jwt.sign(
            { id: result.insertedId, email, fullName: otpRecord.fullName },
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
            message: "Account created successfully",
            token,
            userId: result.insertedId,
            fullName: otpRecord.fullName
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.post("/resend-otp", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const db = await connection();
        const otpCollection = db.collection(OTP_COLLECTION);

        const existingOtpRecord = await otpCollection.findOne({ email });

        if (!existingOtpRecord) {
            return res.status(400).json({ success: false, message: "No pending signup found. Please signup again." });
        }

        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const newOtp = generateOTP();

        await otpCollection.updateOne(
            { email },
            { $set: { otp: newOtp, expiresAt: otpExpiry } }
        );

        res.status(200).json({
            success: true,
            message: "New OTP generated",
            otp: newOtp
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
