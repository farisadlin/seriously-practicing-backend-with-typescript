import { Request, Response } from "express";
import { Task } from "../models/taskModels";
import { pool } from "../config/database";
import { RowDataPacket } from "mysql2";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const connection = await pool.getConnection();
    try {
      await connection.query(
        "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)",
        [title, description, false]
      );

      const newTask: Task = {
        title,
        description,
      };

      res
        .status(201)
        .json({ message: "Task created successfully", data: newTask });
    } catch (error) {
      console.error("Error creating task:", error);
      if ((error as any).code === "ER_ACCESS_DENIED_ERROR") {
        res.status(500).json({
          message: "Database connection error. Please check your credentials.",
        });
      } else {
        res.status(500).json({ message: (error as Error).message });
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error getting database connection:", error);
    res.status(500).json({
      message: "Unable to connect to the database. Please try again later.",
    });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT * FROM tasks WHERE id = ?",
        [parseInt(req.params.id)]
      );

      if (rows.length === 0) {
        res.status(404).send("Task not found");
      } else {
        res.json({ ...rows[0], completed: rows[0].completed === 1 });
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error getting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    try {
      const { title, description, completed } = req.body;
      const [result] = await connection.query(
        "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?",
        [title, description, completed, parseInt(req.params.id)]
      );

      if ((result as any).affectedRows === 0) {
        res.status(404).send("Task not found");
      } else {
        const [updatedTask] = await connection.query<RowDataPacket[]>(
          "SELECT * FROM tasks WHERE id = ?",
          [parseInt(req.params.id)]
        );
        res.json({
          ...updatedTask[0],
          completed: updatedTask[0].completed === 1,
        });
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        "DELETE FROM tasks WHERE id = ?",
        [parseInt(req.params.id)]
      );

      if ((result as any).affectedRows === 0) {
        res.status(404).send("Task not found");
      } else {
        res.status(204).send();
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
