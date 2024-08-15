import { Request, Response } from "express";
import { Task } from "../models/taskModels";

let tasks: Task[] = [];

export const createTask = (req: Request, res: Response) => {
  const task: Task = {
    id: tasks.length + 1,
    title: req.body.title,
    description: req.body.description,
    completed: false,
  };

  tasks.push(task);
  res.status(201).json(task);
  res.json({ message: "Task created successfully", data: req.body });
};

export const getTask = (req: Request, res: Response) => {
  const detailTask = tasks.find((task) => task.id === parseInt(req.params.id));

  if (!detailTask) {
    res.status(404).send("Task not found");
  } else {
    res.json(detailTask);
  }
};

export const updateTask = (req: Request, res: Response) => {
  const detailTask = tasks.find((task) => task.id === parseInt(req.params.id));

  if (!detailTask) {
    res.status(404).send("Task not found");
  } else {
    detailTask.title = req.body.title || detailTask.title;
    detailTask.description = req.body.description || detailTask.description;
    detailTask.completed = req.body.completed || detailTask.completed;

    res.json(detailTask);
  }
};

export const deleteTask = (req: Request, res: Response) => {
  const index = tasks.findIndex((task) => task.id === parseInt(req.params.id));

  if (index === -1) {
    res.status(404).send("Task not found");
  } else {
    tasks.splice(index, 1);
    res.status(204).send();
  }
};
