import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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
