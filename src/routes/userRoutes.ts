import { Router, Request, Response } from "express";
import {
  userRegister,
  userLogin,
  refreshToken,
} from "../controllers/userController";
import authenticateToken from "../middleware/authenticateToken";
import refreshTokenMiddleware from "../middleware/refreshTokenMiddleware";

// Add this line at the top of the file
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const userRouter = Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.post("/refresh-token", refreshToken);
userRouter.get(
  "/protected",
  authenticateToken,
  refreshTokenMiddleware,
  (req: Request, res: Response) => {
    res.json({ message: "Access granted", user: req.user });
  }
);

export default userRouter;
