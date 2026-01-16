import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { PORT } from "./config/env.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(taskRoutes);
app.use(authRoutes);



app.get("/", (req, res) => {

    res.send(
        {
            message: "basic api is working",
            success: true
        }
    )
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
