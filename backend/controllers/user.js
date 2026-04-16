import mysql from "mysql2/promise"
import { getConnection } from "../Database/Db_connect.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



export const getAllUser=async(req,res)=>{

    try{
        const db=getConnection()
        let [users]=await db.query("select * from users")
        res.status(200).json(users)
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }

}
export const addUser =async(req,res)=>{
    try{
        const db=getConnection()
        const {name,email,password}=req.body
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
       
    const hashedPassword = await bcrypt.hash(password, 10)

    await db.query(
      "INSERT INTO users(name,email,password) VALUES (?,?,?)",
      [name, email, hashedPassword]
    )
        return res.status(201).json({message:"User added successfully"})
    }catch{
        return res.status(500).json({message:"Failed to add user"})
    }
}

export const loginUser = async (req, res) => {
  try {
    const db = getConnection();
    const { email, password } = req.body;

    if(!email || !password) return res.status(400).json({message: "All fields required"});

     const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const user = rows[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }
  const token = jwt.sign(
     { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      message: "Login successful",
      token
    })
  } catch(err) {
    console.log(err);
    res.status(500).json({message: "Server error"});
  }
};


export const deleteUser = async(req,res)=>{
    try{
        const db=getConnection()
        const {id}=req.params
        let [result]= await db.query("DELETE FROM users where id=?",[id])
        if(result.affectedRows===0){
            return res.status(404).json({message:"User not found"})
        }
        res.json({message:"User deleted"})
    }
    catch{
        res.status(500).json({message:"Failed to delete the user"})
    }
}

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const db = getConnection();
    const [result] = await db.query(
      "UPDATE users SET name=?, email=? WHERE id=?",
      [name, email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const authChecker= async(req,res)=>{
  res.json(req.user)
}