import { Request, Response } from "express";
import { Task } from "../models/taskModels";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import {
  executeQuery,
  getConnection,
  handleError,
  verifyToken,
} from "../utils";

// Controllers
export const createTask = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const { userId } = verifyToken(token);
      const { title, description } = req.body;

      const [result] = (await executeQuery(
        connection,
        "INSERT INTO tasks (user_id, title, description, completed) VALUES (?, ?, ?, ?)",
        [userId, title, description, false]
      )) as ResultSetHeader[];

      const newTask: Task = {
        id: result.insertId,
        userId,
        title,
        description,
        completed: false,
      };
      res
        .status(201)
        .json({ message: "Task created successfully", data: newTask });
    } catch (jwtError) {
      console.error("Error decoding JWT:", jwtError);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    handleError(res, error, "creating task");
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const { userId } = verifyToken(token);
      const [rows] = (await executeQuery(
        connection,
        "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
        [parseInt(req.params.id), userId]
      )) as RowDataPacket[];

      if (rows.length === 0) {
        res.status(404).send("Task not found");
      } else {
        res.json({ ...rows[0], completed: rows[0].completed === 1 });
      }
    } catch (jwtError) {
      console.error("Error decoding JWT:", jwtError);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    handleError(res, error, "getting task");
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const { userId } = verifyToken(token);
      const { title, description, completed } = req.body;
      const [result] = (await executeQuery(
        connection,
        "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?",
        [title, description, completed, parseInt(req.params.id), userId]
      )) as ResultSetHeader[];

      if (result.affectedRows === 0) {
        res.status(404).send("Task not found");
      } else {
        const [updatedTask] = (await executeQuery(
          connection,
          "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
          [parseInt(req.params.id), userId]
        )) as RowDataPacket[];
        res.json({
          ...updatedTask[0],
          completed: updatedTask[0].completed === 1,
        });
      }
    } catch (jwtError) {
      console.error("Error decoding JWT:", jwtError);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    handleError(res, error, "updating task");
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const { userId } = verifyToken(token);
      const [result] = (await executeQuery(
        connection,
        "DELETE FROM tasks WHERE id = ? AND user_id = ?",
        [parseInt(req.params.id), userId]
      )) as ResultSetHeader[];

      if (result.affectedRows === 0) {
        res.status(404).send("Task not found");
      } else {
        res.status(204).json({ message: "Task deleted successfully" });
      }
    } catch (jwtError) {
      console.error("Error decoding JWT:", jwtError);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    handleError(res, error, "deleting task");
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const { userId } = verifyToken(token);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const [tasks] = (await executeQuery(
        connection,
        "SELECT * FROM tasks WHERE user_id = ? LIMIT ? OFFSET ?",
        [userId, limit, offset]
      )) as RowDataPacket[];

      const [totalCount] = (await executeQuery(
        connection,
        "SELECT COUNT(*) as count FROM tasks WHERE user_id = ?",
        [userId]
      )) as RowDataPacket[];

      const totalPages = Math.ceil(totalCount[0].count / limit);

      res.json({
        tasks: tasks.map((task: Task) => ({
          ...task,
          completed: task.completed === 1,
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount[0].count,
          itemsPerPage: limit,
        },
      });
    } catch (jwtError) {
      console.error("Error decoding JWT:", jwtError);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    handleError(res, error, "getting all tasks");
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const { userId } = verifyToken(token);
      const { completed } = req.body;
      const [result] = (await executeQuery(
        connection,
        "UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?",
        [completed === true ? 1 : 0, parseInt(req.params.id), userId]
      )) as ResultSetHeader[];

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Task not found" });
      } else {
        const [updatedTask] = (await executeQuery(
          connection,
          "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
          [parseInt(req.params.id), userId]
        )) as RowDataPacket[];
        res.json({
          message: "Task status updated successfully",
          task: {
            ...updatedTask[0],
            completed: updatedTask[0].completed === 1,
          },
        });
      }
    } catch (jwtError) {
      console.error("Error decoding JWT:", jwtError);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    handleError(res, error, "updating task status");
  }
};
