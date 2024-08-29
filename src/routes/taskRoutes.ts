import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController";
import {
  createTaskSchemas,
  deleteTaskSchemas,
  updateTaskSchemas,
  updateTaskStatusSchemas,
} from "../schemas/taskSchemas";
import authenticateToken from "../middleware/authenticateToken";

const taskRouter = Router();

taskRouter.post(
  "/create",
  authenticateToken,
  validateData(createTaskSchemas),
  createTask
);
taskRouter.get("/get/all", authenticateToken, getAllTasks);
taskRouter.get("/get/:id", authenticateToken, getTask);
taskRouter.put(
  "/update/:id",
  authenticateToken,
  validateData(updateTaskSchemas),
  updateTask
);
taskRouter.put(
  "/update/status/:id",
  authenticateToken,
  validateData(updateTaskStatusSchemas),
  updateTaskStatus
);
taskRouter.delete(
  "/delete/:id",
  authenticateToken,
  validateData(deleteTaskSchemas),
  deleteTask
);

export default taskRouter;
