const express = require("express");
const {connection}=require("./db");
const {userRouter}=require("./route/user.route");
const {noteRoute}=require("./route/note.route");
const { auth } = require("./middleware/note.middleware");
const cors = require("cors");

require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());
app.use("/user",userRouter);
app.use(auth);
app.use("/note",noteRoute);

app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Connected to db");
    } catch (error) {
        console.log(error);
    }
    console.log("server is running");
})
