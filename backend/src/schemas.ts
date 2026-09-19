import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `must be at most ${max} characters`)
    .nullish()
    .transform((v) => (v ? v : null));

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "must be at least 3 characters")
    .max(50, "must be at most 50 characters"),
  email: z.string().trim().toLowerCase().max(255).email("invalid email"),
  password: z
    .string()
    .min(8, "must be at least 8 characters")
    .max(72, "must be at most 72 characters"), // лимит bcrypt
  role: z.enum(["jobseeker", "employer"], { message: "invalid role" }),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, "is required"),
  password: z.string().min(1, "is required"),
});

export const vacancySchema = z.object({
  title: z.string().trim().min(1, "is required").max(255),
  type: z.enum(["Full-Time", "Part-Time", "Contract", "Internship"], {
    message: "invalid vacancy type",
  }),
  location: z.string().trim().min(1, "is required").max(255),
  description: z.string().trim().min(1, "is required").max(10000),
  salary: optionalText(100),
  company_name: z.string().trim().min(1, "is required").max(255),
  company_description: optionalText(5000),
  company_contact_email: z.string().trim().max(255).email("invalid email"),
  company_contact_phone: optionalText(50),
});

export const statusSchema = z.object({
  status: z.enum(["delivered", "reviewed", "invite for interview"], {
    message: "Invalid application status",
  }),
});
