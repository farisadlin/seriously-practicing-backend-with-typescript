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
  updateTaskSchemas,
  updateTaskStatusSchemas,
} from "../schemas/taskSchemas";
import authenticateToken from "../middleware/authenticateToken";

const taskRouter = Router();

// Apply authenticateToken middleware to all routes
taskRouter.use(authenticateToken);

taskRouter.post("/create", validateData(createTaskSchemas), createTask);
taskRouter.get("/get/all", getAllTasks);
taskRouter.get("/get/:id", getTask);
taskRouter.put("/update/:id", validateData(updateTaskSchemas), updateTask);
taskRouter.put(
  "/update/status/:id",
  validateData(updateTaskStatusSchemas),
  updateTaskStatus
);
taskRouter.delete("/delete/:id", deleteTask);

export default taskRouter;
