import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllSessions, getSessionById, getGraphData, addSession, deleteSession } from "../controllers/sessionsController.js";

const router = express.Router({ mergeParams: true });

router.get("/graph", authMiddleware, getGraphData);       // ⚠️ must stay above /:session_id
router.get("/", authMiddleware, getAllSessions);
router.get("/:session_id", authMiddleware, getSessionById);
router.post("/", authMiddleware, addSession);
router.delete("/:session_id", authMiddleware, deleteSession);

export default router;