import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import { createTask, deleteTask, getTask, updateTask } from "./taskController";
import { taskSchemas } from "../schemas/taskschemas";

const taskRouter = Router();

taskRouter.post("/create", validateData(taskSchemas), createTask);
taskRouter.get("/get/:id", validateData(taskSchemas), getTask);
taskRouter.put("/update/:id", validateData(taskSchemas), updateTask);
taskRouter.delete("/delete/:id", validateData(taskSchemas), deleteTask);

export default taskRouter;
