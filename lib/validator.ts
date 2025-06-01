import { z } from "zod";

export const NoteSchemaValidation = z.object({
  title: z
    .string()
    .max(100, "Title can't exceed 100 characters")
    .optional()
    .nullable(),
  note: z.string().min(1, "note is required."),
});
