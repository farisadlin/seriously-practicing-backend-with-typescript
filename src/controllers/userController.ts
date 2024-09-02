import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { pool } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/userModels";

dotenv.config();

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    const existingUser = rows as User[];

    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query<ResultSetHeader>(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: "Authentication failed" });
    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ error: "Authentication failed" });

    const jwtSecret = process.env.JWT_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!jwtSecret || !refreshTokenSecret) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId: user.id }, refreshTokenSecret, {
      expiresIn: "7d",
    });

    await pool.query<ResultSetHeader>(
      "UPDATE users SET refresh_token = ? WHERE id = ?",
      [refreshToken, user.id]
    );

    res.json({ token, refresh_token: refreshToken });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refresh_token: refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE refresh_token = ?",
      [refreshToken]
    );
    const users = rows as User[];
    if (users.length === 0) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      refreshTokenSecret,
      (err: jwt.VerifyErrors | null, user: any) => {
        if (err) return res.sendStatus(403);

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          return res.status(500).json({ error: "Server configuration error" });
        }

        const token = jwt.sign({ userId: user.userId }, jwtSecret, {
          expiresIn: "15m",
        });

        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Error refreshing token" });
  }
};
