import { Router } from "express";
import { pool } from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validate, uuidParam } from "../middleware/validate.js";
import { vacancySchema } from "../schemas.js";
import { removeUploadedFile } from "../middleware/upload.js";

const router = Router();
router.param("id", uuidParam);
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM vacancies ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch vacancies" });
  }
});
router.get("/mine", authenticate, requireRole("employer"), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT v.*,
              COUNT(a.id)::int AS applications_count,
              COUNT(a.id) FILTER (WHERE a.status = 'delivered')::int AS new_count
       FROM vacancies v
       LEFT JOIN applications a ON a.vacancy_id = v.id
       WHERE v.created_by = $1
       GROUP BY v.id
       ORDER BY v.created_at DESC`,
      [req.user!.userId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch vacancies" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vacancies WHERE id = $1", [
      req.params.id,
    ]);

    const vacancy = result.rows[0];

    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    res.json(vacancy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch vacancy" });
  }
});

router.post(
  "/",
  authenticate,
  requireRole("employer"),
  validate(vacancySchema),
  async (req, res) => {
    const {
      title,
      type,
      location,
      description,
      salary,
      company_name,
      company_description,
      company_contact_email,
      company_contact_phone,
    } = req.body;

    if (
      !title ||
      !type ||
      !location ||
      !description ||
      !company_name ||
      !company_contact_email
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const result = await pool.query(
        `INSERT INTO vacancies
        (title, type, location, description, salary, company_name, company_description, company_contact_email, company_contact_phone, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
        [
          title,
          type,
          location,
          description,
          salary ?? null,
          company_name,
          company_description ?? null,
          company_contact_email,
          company_contact_phone ?? null,
          req.user!.userId,
        ],
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create vacancy" });
    }
  },
);

router.put(
  "/:id",
  authenticate,
  requireRole("employer"),
  validate(vacancySchema),
  async (req, res) => {
    try {
      const existing = await pool.query(
        "SELECT created_by FROM vacancies WHERE id = $1",
        [req.params.id],
      );

      const vacancy = existing.rows[0];

      if (!vacancy) {
        return res.status(404).json({ message: "Vacancy not found" });
      }

      if (vacancy.created_by !== req.user!.userId) {
        return res
          .status(403)
          .json({ message: "You don't have permission to edit this vacancy" });
      }

      const {
        title,
        type,
        location,
        description,
        salary,
        company_name,
        company_description,
        company_contact_email,
        company_contact_phone,
      } = req.body;

      const result = await pool.query(
        `UPDATE vacancies
       SET title = $1, type = $2, location = $3, description = $4, salary = $5,
           company_name = $6, company_description = $7, company_contact_email = $8, company_contact_phone = $9
       WHERE id = $10
       RETURNING *`,
        [
          title,
          type,
          location,
          description,
          salary ?? null,
          company_name,
          company_description ?? null,
          company_contact_email,
          company_contact_phone ?? null,
          req.params.id,
        ],
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update vacancy" });
    }
  },
);

router.delete(
  "/:id",
  authenticate,
  requireRole("employer"),
  async (req, res) => {
    try {
      const existing = await pool.query(
        "SELECT created_by FROM vacancies WHERE id = $1",
        [req.params.id],
      );

      const vacancy = existing.rows[0];

      if (!vacancy) {
        return res.status(404).json({ message: "Vacancy not found" });
      }

      if (vacancy.created_by !== req.user!.userId) {
        return res.status(403).json({
          message: "You don't have permission to delete this vacancy",
        });
      }

      const files = await pool.query(
        "SELECT resume_path FROM applications WHERE vacancy_id = $1 AND resume_path IS NOT NULL",
        [req.params.id],
      );

      await pool.query("DELETE FROM vacancies WHERE id = $1", [req.params.id]);

      await Promise.all(
        files.rows.map((row) => removeUploadedFile(row.resume_path)),
      );

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete vacancy" });
    }
  },
);

export default router;
