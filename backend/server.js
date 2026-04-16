import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors"
import mysql from "mysql2/promise"
import { connectDB } from "./Database/Db_connect.js";
import {setupUserDB} from "./Database/setupUserDB.js"
import { setupCasesDB } from "./Database/setupCasesDB.js";
import { setupSessionsDB } from "./Database/setupSessionsDB.js";
import userRouter from "./routes/userRoutes.js";
import casesRouter from "./routes/casesRoutes.js";
import sessionsRouter from "./routes/sessionsRoutes.js";
import jwt from "jsonwebtoken"


const app= express()
app.use(express.json())
app.use(cors())
const startServer= async()=>{
    try{
        await connectDB()
        await setupUserDB()
        await setupCasesDB();
        await setupSessionsDB();
        app.use("/user",userRouter)
        app.use("/cases", casesRouter);
        app.use("/cases/:case_id/sessions", sessionsRouter);
        const port = process.env.PORT
        app.listen(port,()=>{
            console.log(`Server is running on http://localhost:${port}`)
        })
    }catch{
        console.log("Server failed to start")
    }
}

startServer()