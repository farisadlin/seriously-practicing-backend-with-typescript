import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  user?: string | JwtPayload | undefined;
  tokenExpired?: boolean;
}

const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        // Token is expired, but don't send an error message
        // Instead, set a flag to indicate token expiration
        req.tokenExpired = true;
        return next();
      }
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
