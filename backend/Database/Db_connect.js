import mysql from 'mysql2/promise'

let connection
export const connectDB= async()=>{
    try{
        connection= await  mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD // empty if no password
        });
        console.log("Connected with Mysql")
    }

catch(err){
    console.log(err)
}
}

export const getConnection=()=>{
    if(!connection){
        throw new Error("call connectDB first")
    }
    return connection
}
