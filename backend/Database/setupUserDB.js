import { getConnection } from "./Db_connect.js";


        
        export const setupUserDB= async()=>{
        let db=getConnection()
        await db.query(`create database if not exists ${process.env.DB_NAME}`)
        await db.query(`use  ${process.env.DB_NAME}`)
        await db.query("create table if not exists users(id int AUTO_INCREMENT PRIMARY KEY,name varchar(20) NOT NULL,email varchar(50) UNIQUE NOT NULL,password varchar(255) NOT NULL)")
        }
        
    

    