import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import { createTask, deleteTask, getTask, updateTask } from "./taskController";
import {
  createTaskSchemas,
  deleteTaskSchemas,
  updateTaskSchemas,
} from "../schemas/taskSchemas";

const taskRouter = Router();

taskRouter.post("/create", validateData(createTaskSchemas), createTask);
taskRouter.get("/get/:id", getTask);
taskRouter.put("/update/:id", validateData(updateTaskSchemas), updateTask);
taskRouter.delete("/delete/:id", validateData(deleteTaskSchemas), deleteTask);

export default taskRouter;
