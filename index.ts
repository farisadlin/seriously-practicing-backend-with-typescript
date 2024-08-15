import express, { Express } from "express";
import taskRoutes from "./src/routes/taskRoutes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
