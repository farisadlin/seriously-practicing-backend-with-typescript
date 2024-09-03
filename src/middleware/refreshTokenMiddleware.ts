import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";
import { RowDataPacket } from "mysql2";

interface RefreshRequest extends Request {
  tokenExpired?: boolean;
  user?: any;
}

const refreshTokenMiddleware = async (
  req: RefreshRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.tokenExpired) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE refresh_token = ?",
        [refreshToken]
      );
      if (rows.length === 0) return res.sendStatus(403);

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        (err: any, user: any) => {
          if (err) return res.sendStatus(403);

          const accessToken = jwt.sign(
            { userId: user.userId },
            process.env.JWT_SECRET as string,
            { expiresIn: "15m" }
          );

          res.setHeader("Authorization", `Bearer ${accessToken}`);
          req.user = user;
          next();
        }
      );
    } catch (error) {
      console.error("Error refreshing token:", error);
      return res.sendStatus(500);
    }
  } else {
    next();
  }
};

export default refreshTokenMiddleware;
