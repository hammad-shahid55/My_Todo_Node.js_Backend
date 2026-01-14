import express from "express";
const app = express();


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