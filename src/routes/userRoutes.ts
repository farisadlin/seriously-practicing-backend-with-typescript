import { Router } from "express";
import {
  userRegister,
  userLogin,
  refreshToken,
} from "../controllers/userController";
import authenticateToken from "../middleware/authenticateToken";

const userRouter = Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/protected", authenticateToken);

export default userRouter;
