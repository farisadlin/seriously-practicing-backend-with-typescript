import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import taskRouter from "./routes/taskRoutes";
import userRouter from "./routes/userRoutes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/api/task", taskRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
