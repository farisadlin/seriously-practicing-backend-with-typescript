import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import taskRouter from "./routes/taskRoutes";
import userRouter from "./routes/userRoutes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/task", taskRouter);
app.use("/api/auth", userRouter);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
