import { Router } from "express";
import { pool } from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, requireRole("jobseeker"), async (req, res) => {
  const { vacancy_id } = req.body;

  if (!vacancy_id) {
    return res.status(400).json({ message: "vacancy_id is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO applications (user_id, vacancy_id)
       VALUES ($1, $2)
       RETURNING *`,
      [req.user!.userId, vacancy_id],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    const dbError = error as { code?: string };

    if (dbError.code === "23505") {
      return res
        .status(409)
        .json({ message: "You already applied to this vacancy" });
    }

    if (dbError.code === "23503") {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    console.error(error);
    res.status(500).json({ message: "Failed to create application" });
  }
});

router.get("/my", authenticate, requireRole("jobseeker"), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT applications.*, vacancies.title, vacancies.company_name
       FROM applications
       JOIN vacancies ON vacancies.id = applications.vacancy_id
       WHERE applications.user_id = $1
       ORDER BY applications.created_at DESC`,
      [req.user!.userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

router.delete(
  "/:vacancyId",
  authenticate,
  requireRole("jobseeker"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `DELETE FROM applications
         WHERE user_id = $1 AND vacancy_id = $2
         RETURNING id`,
        [req.user!.userId, req.params.vacancyId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to cancel application" });
    }
  },
);

router.get(
  "/vacancy/:vacancyId",
  authenticate,
  requireRole("employer"),
  async (req, res) => {
    try {
      const vacancyResult = await pool.query(
        "SELECT created_by FROM vacancies WHERE id = $1",
        [req.params.vacancyId],
      );

      const vacancy = vacancyResult.rows[0];

      if (!vacancy) {
        return res.status(404).json({ message: "Vacancy not found" });
      }

      if (vacancy.created_by !== req.user!.userId) {
        return res.status(403).json({
          message: "You don't have permission to view these applications",
        });
      }

      const result = await pool.query(
        `SELECT applications.*, users.username, users.email
         FROM applications
         JOIN users ON users.id = applications.user_id
         WHERE applications.vacancy_id = $1
         ORDER BY applications.created_at DESC`,
        [req.params.vacancyId],
      );

      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  },
);

export default router;
