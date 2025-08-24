import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();
app.use(express.static('dist'));
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [
      "http://localhost:5173",              // local frontend
      "https://venerable-biscochitos-bf7e36.netlify.app","https://careercatalystjobportal.netlify.app", // deployed frontend
      process.env.FRONTEND_URL              // from .env if set
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],  // plural
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
dbConnection();

app.use(errorMiddleware);
export default app;
