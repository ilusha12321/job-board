import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: unknown): value is string =>
  typeof value === "string" && UUID_RE.test(value);

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issue = result.error.issues[0];
      const field = issue.path.join(".");
      return res
        .status(400)
        .json({
          message: field ? `${field}: ${issue.message}` : issue.message,
        });
    }
    req.body = result.data;
    next();
  };
}
export function uuidParam(
  req: Request,
  res: Response,
  next: NextFunction,
  value: string,
) {
  if (!isUuid(value)) {
    return res.status(404).json({ message: "Not found" });
  }
  next();
}
