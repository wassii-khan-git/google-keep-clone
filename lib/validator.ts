import { z } from "zod";

export const NoteSchemaValidation = z.object({
  title: z
    .string()
    .max(100, "Title can't exceed 100 characters")
    .optional()
    .nullable(),
  note: z.string().min(1, "note is required."),
});

export const SignInSchema = z.object({
  email: z.string().email("invalid email format"),
  password: z.string().min(8, "password must be at least 8 characters"),
});

export const SignUpSchema = z.object({
  username: z.string().min(1, "username is required"),
  email: z.string().email("invalid email format"),
  password: z.string().min(8, "password must be at least 8 characters"),
});
