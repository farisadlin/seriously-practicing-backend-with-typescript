import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import {
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from "../controllers/taskController";
import {
  createTaskSchemas,
  deleteTaskSchemas,
  updateTaskSchemas,
} from "../schemas/taskSchemas";
import authenticateToken from "../middleware/authenticateToken";

const taskRouter = Router();

taskRouter.post(
  "/create",
  authenticateToken,
  validateData(createTaskSchemas),
  createTask
);
taskRouter.get("/get/:id", authenticateToken, getTask);
taskRouter.put(
  "/update/:id",
  authenticateToken,
  validateData(updateTaskSchemas),
  updateTask
);
taskRouter.delete(
  "/delete/:id",
  authenticateToken,
  validateData(deleteTaskSchemas),
  deleteTask
);

export default taskRouter;
