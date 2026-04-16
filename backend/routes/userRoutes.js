import express from "express";
import { addUser, deleteUser, getAllUser, updateUser,loginUser, authChecker } from "../controllers/user.js";
import authMiddleware from "../middleware/authMiddleware.js";
const userRouter=express.Router()



userRouter.get('/data',getAllUser)
userRouter.get('/authCheck',authMiddleware,authChecker)
userRouter.post('/add',addUser)
userRouter.delete('/:id',deleteUser)
userRouter.put("/:id",updateUser)
userRouter.post("/login", loginUser);
export default userRouter