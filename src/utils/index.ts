import { pool } from "../config/database"; // Adjust the import path as needed
import jwt from "jsonwebtoken";
import { Response } from "express";

interface JwtPayload {
  userId: string;
}

// Reusable functions
export const getConnection = async () => await pool.getConnection();

export const executeQuery = async (
  connection: any,
  query: string,
  params: any[]
) => {
  try {
    return await connection.query(query, params);
  } finally {
    connection.release();
  }
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
};

export const handleError = (res: Response, error: any, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ message: "Internal server error" });
};
