import { Router } from "express";
import { pool } from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import path from "path";

const router = Router();

router.post(
  "/",
  authenticate,
  requireRole("jobseeker"),
  upload.single("resume"),
  async (req, res) => {
    const { vacancy_id } = req.body;

    if (!vacancy_id) {
      return res.status(400).json({ message: "vacancy_id is required" });
    }

    const resumeName = req.file ? req.file.originalname : null;
    const resumePath = req.file ? req.file.filename : null;
    const resumeSize = req.file ? req.file.size : null;

    try {
      const result = await pool.query(
        `INSERT INTO applications (user_id, vacancy_id, resume_name, resume_path, resume_size)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [req.user!.userId, vacancy_id, resumeName, resumePath, resumeSize],
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
  },
);

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
router.get(
  "/employer",
  authenticate,
  requireRole("employer"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT applications.*, vacancies.title, users.username, users.email
       FROM applications
       JOIN vacancies ON vacancies.id = applications.vacancy_id
       JOIN users ON users.id = applications.user_id
       WHERE vacancies.created_by = $1
       ORDER BY applications.created_at DESC`,
        [req.user!.userId],
      );

      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  },
);
router.patch(
  "/:id/status",
  authenticate,
  requireRole("employer"),
  async (req, res) => {
    const { status } = req.body;

    const allowedStatuses = ["delivered", "reviewed", "invite for interview"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    try {
      const result = await pool.query(
        `UPDATE applications
         SET status = $1
         WHERE id = $2
           AND vacancy_id IN (
             SELECT id
             FROM vacancies
             WHERE created_by = $3
           )
         RETURNING *`,
        [status, req.params.id, req.user!.userId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Application not found" });
      }

      const application = result.rows[0];

      const detailsResult = await pool.query(
        `SELECT applications.*, vacancies.title, users.username, users.email
         FROM applications
         JOIN vacancies ON vacancies.id = applications.vacancy_id
         JOIN users ON users.id = applications.user_id
         WHERE applications.id = $1`,
        [application.id],
      );

      res.json(detailsResult.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update application status" });
    }
  },
);

router.get("/:id/resume", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT applications.user_id, applications.resume_path, applications.resume_name,
                vacancies.created_by
         FROM applications
         JOIN vacancies ON vacancies.id = applications.vacancy_id
         WHERE applications.id = $1`,
      [req.params.id],
    );

    const application = result.rows[0];

    if (!application || !application.resume_path) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const isApplicant = application.user_id === req.user!.userId;
    const isVacancyOwner = application.created_by === req.user!.userId;

    if (!isApplicant && !isVacancyOwner) {
      return res.status(403).json({ message: "Access denied" });
    }

    const filePath = path.join(
      process.cwd(),
      "uploads",
      application.resume_path,
    );
    res.download(filePath, application.resume_name);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to download resume" });
  }
});
export default router;
