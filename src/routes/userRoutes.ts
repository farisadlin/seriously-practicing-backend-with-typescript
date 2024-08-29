import { Router } from "express";
import { userRegister, userLogin } from "../controllers/userController";
import authenticateToken from "../middleware/authenticateToken";

const userRouter = Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/protected", authenticateToken);

export default userRouter;
