import { Router } from "express";
import { ObjectId } from "mongodb";
import { connection, collectionName } from "../dbconfig.js";

const router = Router();

router.post("/add-task", async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(req.body);

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

router.get("/tasks", async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.find({}).toArray();

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

router.delete("/delete-task/:id", async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

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

router.delete("/delete-all-tasks", async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.deleteMany({});

        if (result) {
            res.send({
                message: "All tasks deleted successfully",
                success: true,
                data: result
            });
        } else {
            res.send({
                message: "All tasks not deleted",
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

router.put("/update-task/:id", async (req, res) => {
    try {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

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
