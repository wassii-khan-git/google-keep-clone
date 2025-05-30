// form data validation
import { z } from "zod";

export const Note = z.object({
  title: z.string(),
  note: z.string(),
});

export const AddNote = async (formdata: FormData) => {};
