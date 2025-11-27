import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateSubTaskStage,
  updateTask,
  updateTaskStage,
  upload_screenshot,
  getTaskScreenshots,
} from "../controllers/taskController.js";

import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create & Duplicate
router.post("/create", protectRoute, isAdminRoute, createTask);
router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);

// ✅ Task Activity
router.post("/activity/:id", protectRoute, postTaskActivity);

// ✅ Dashboard Statistics
router.get("/dashboard", protectRoute, dashboardStatistics);

// ✅ Fetch All or Single Task
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);

// ✅ Fetch Task Screenshots (REST format)
router.get("/screenshots/:taskId", protectRoute, getTaskScreenshots);


// ✅ Subtask & Update Operations
router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
router.put("/update/:id", protectRoute, isAdminRoute, updateTask);
router.put("/change-stage/:id", protectRoute, updateTaskStage);

// ✅ Upload Screenshot (Binary)
router.put(
  "/upload_screenshot/:taskId",
  protectRoute,
  express.raw({ type: "application/octet-stream", limit: "10mb" }), // Parse raw binary data
  upload_screenshot
);

// ✅ Trash / Delete / Restore
router.put("/:id", protectRoute, isAdminRoute, trashTask);
router.delete(
  "/delete-restore/:id?",
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
);

export default router;
