import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import authRouter from "./routes/auth.js";
import vacanciesRouter from "./routes/vacancies.js";
import cookieParser from "cookie-parser";
import applicationsRouter from "./routes/applications.js";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/vacancies", vacanciesRouter);
app.use("/api/applications", applicationsRouter);

app.get("/api/health", (req, res) => {
  {
    res.json({ status: "ok" });
  }
});
pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

app.listen(PORT, () => {
  console.log("Server started");
});
