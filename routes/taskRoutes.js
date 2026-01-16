import { Router } from "express";
import { ObjectId } from "mongodb";
import { connection, collectionName } from "../dbconfig.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/add-task", verifyToken, async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const taskData = {
            ...req.body,
            userId: req.user.id
        };
        const result = await collection.insertOne(taskData);

        if (result) {
            res.send({
                message: "Task added successfully",
                success: true,
                data: result
            });
        } else {
            res.send({
                message: "Task not added",
                success: false,
                data: result
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error adding task",
            success: false,
            error: error.message
        });
    }
});

router.get("/tasks", verifyToken, async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.find({ userId: req.user.id }).toArray();

        if (result) {
            res.send({
                message: "Tasks fetched successfully",
                success: true,
                data: result
            });
        } else {
            res.send({
                message: "Tasks not fetched",
                success: false,
                data: result
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error fetching tasks",
            success: false,
            error: error.message
        });
    }
});

router.delete("/delete-task/:id", verifyToken, async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id), userId: req.user.id });

        if (result) {
            res.send({
                message: "Task deleted successfully",
                success: true,
                data: result
            });
        } else {
            res.send({
                message: "Task not deleted",
                success: false,
                data: result
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error deleting task",
            success: false,
            error: error.message
        });
    }
});

router.delete("/delete-all-tasks", verifyToken, async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const { ids } = req.body;

        let result;
        if (ids && Array.isArray(ids) && ids.length > 0) {
            result = await collection.deleteMany({
                _id: { $in: ids.map(id => new ObjectId(id)) },
                userId: req.user.id
            });
        } else {
            result = await collection.deleteMany({ userId: req.user.id });
        }

        if (result) {
            res.send({
                message: "Tasks deleted successfully",
                success: true,
                data: result
            });
        } else {
            res.send({
                message: "Tasks not deleted",
                success: false,
                data: result
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error deleting tasks",
            success: false,
            error: error.message
        });
    }
});

router.put("/update-task/:id", verifyToken, async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.updateOne({ _id: new ObjectId(req.params.id), userId: req.user.id }, { $set: req.body });

        if (result) {
            res.send({
                message: "Task updated successfully",
                success: true,
                data: result
            });
        } else {
            res.send({
                message: "Task not updated",
                success: false,
                data: result
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error updating task",
            success: false,
            error: error.message
        });
    }
});

export default router;
