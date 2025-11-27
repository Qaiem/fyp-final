// routes/geminiRoutes.js
import express from "express";
import { predictDeadline } from "../controllers/geminiController.js";

const router = express.Router();

router.get("/analyze/:taskId", predictDeadline);

export default router;
