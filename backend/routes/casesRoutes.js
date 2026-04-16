import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllCases, getCaseById, createCase, deleteCase,getCasesByInjury,getCasesByPatientName } from "../controllers/casesController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllCases);
router.get("/search/patient", authMiddleware, getCasesByPatientName)   // ⚠️ must be above /:id
router.get("/search/injury", authMiddleware, getCasesByInjury)    
router.get("/:id", authMiddleware, getCaseById);
router.post("/", authMiddleware, createCase);
router.delete("/:id", authMiddleware, deleteCase);

export default router;