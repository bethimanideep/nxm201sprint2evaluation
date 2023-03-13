const express=require("express");
const { connection } = require("./models/model");
const { route } = require("./routes/routes");
const app=express()
app.use(express.json())
app.use("/",route)
app.get("/",(req,res)=>{
    res.json("welcome");
})

app.listen(4500, async()=>{
    try {
        await connection
        console.log("connected to db");
    } catch (error) {
        console.log(error);
    }
    console.log("server running");
})