import express from "express";
import { connection, collectionName } from "./dbconfig.js";
import cors from "cors";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cors());


app.post("/add-task", async (req, res) => {
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

})

app.get("/tasks", async (req, res) => {
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

})

app.delete("/delete-task/:id", async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({_id: new ObjectId(req.params.id)});
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

})

app.delete("/delete-all-tasks", async (req, res) => {
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

})

app.put("/update-task/:id", async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.updateOne({_id: new ObjectId(req.params.id)}, {$set: req.body});
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

})



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