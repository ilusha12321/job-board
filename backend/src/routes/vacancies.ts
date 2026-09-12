import { Router } from "express";
import { pool } from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

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

// POST /api/vacancies — тільки залогінений employer
router.post("/", authenticate, requireRole("employer"), async (req, res) => {
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
});

// PUT /api/vacancies/:id — тільки власник-employer
router.put("/:id", authenticate, requireRole("employer"), async (req, res) => {
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
});

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
        return res
          .status(403)
          .json({
            message: "You don't have permission to delete this vacancy",
          });
      }

      await pool.query("DELETE FROM vacancies WHERE id = $1", [req.params.id]);

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete vacancy" });
    }
  },
);

export default router;
