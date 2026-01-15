import express from "express";
import { connection, collectionName } from "./dbconfig.js";
const app = express();


app.use(express.json());



app.post("/add-task", async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    if(result){
        res.send({
            message:"Task added successfully",
            success:true,
            data:result
        });
    }else{
        res.send({
            message:"Task not added",
            success:false,
            data:result
        });
    }
   
})


app.get("/", (req, res) => {

    res.send(
        {
            message:"basic api is working",
            success:true
        }
    )
})

app.listen(3200, () => {
    console.log("Server is running on port 3200");
})