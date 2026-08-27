import { z } from "zod";

export const getCollegesQuerySchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  minFees: z.coerce.number().min(0, "minFees cannot be negative").optional(),
  maxFees: z.coerce.number().min(0, "maxFees cannot be negative").optional(),
  minRating: z.coerce.number().min(0).max(5, "rating must be between 0 and 5").optional(),
  sort: z.enum([
    "rating-desc",
    "rating-asc",
    "fees-asc",
    "fees-desc",
    "name-asc",
    "name-desc",
  ]).optional().default("rating-desc"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50, "limit cannot exceed 50").optional().default(10),
});

export type GetCollegesQuery = z.infer<typeof getCollegesQuerySchema>;

// Slug validation: non-empty, max 100 chars, only lowercase letters, numbers, and hyphens.
export const collegeSlugSchema = z
  .string()
  .min(1, "Slug cannot be empty")
  .max(100, "Slug cannot exceed 100 characters")
  .regex(/^[a-z0-9-]+$/, "Slug contains invalid characters");

// Compare API validation: 2-3 comma-separated slugs
export const compareSlugsSchema = z
  .string()
  .min(1, "Slugs parameter is required")
  .transform((str) => str.split(",").map((s) => s.trim()).filter(Boolean))
  .refine((slugs) => slugs.length >= 2 && slugs.length <= 3, {
    message: "You must provide exactly 2 or 3 colleges to compare",
  })
  .refine((slugs) => new Set(slugs).size === slugs.length, {
    message: "Duplicate colleges are not allowed",
  })
  .superRefine((slugs, ctx) => {
    for (const slug of slugs) {
      const parsed = collegeSlugSchema.safeParse(slug);
      if (!parsed.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid slug format: ${slug}`,
        });
      }
    }
  });

// Predictor API validation
export const predictorRequestSchema = z.object({
  exam: z.enum(["JEE_MAIN", "JEE_ADVANCED", "BITSAT", "STATE_CET", "CUET"], {
    required_error: "Exam is required",
    invalid_type_error: "Invalid exam type",
  }),
  category: z.enum(["GENERAL", "OBC", "SC", "ST", "EWS"], {
    required_error: "Category is required",
    invalid_type_error: "Invalid student category",
  }),
  rank: z
    .number({
      required_error: "Rank is required",
      invalid_type_error: "Rank must be a number",
    })
    .int("Rank must be an integer")
    .positive("Rank must be greater than 0")
    .max(10000000, "Rank exceeds maximum allowed value"),
});

export type PredictorRequest = z.infer<typeof predictorRequestSchema>;


