import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

import { StatusCodes } from "http-status-codes";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Create a new schema that doesn't allow empty strings
      const nonEmptySchema = schema.transform((data) => {
        Object.keys(data).forEach((key) => {
          if (typeof data[key] === "string" && data[key].trim() === "") {
            throw new Error(`${key} cannot be empty`);
          }
        });
        return data;
      });

      // Validate using the new schema
      nonEmptySchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: "Invalid data", details: errorMessages });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: "Internal Server Error",
        });
      }
    }
  };
}
