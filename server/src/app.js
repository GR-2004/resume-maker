import express from "express";
import resumeRouter from "./routes/Resume.route.js";
import userRouter from "./routes/User.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Allow your frontend origin
    credentials: true, // If you're using cookies
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use("/api/resume", resumeRouter);
app.use("/api/user", userRouter);

export default app;
