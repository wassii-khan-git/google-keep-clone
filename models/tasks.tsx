import mongoose, { Schema } from "mongoose";

const NotesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
      maxlength: 20000,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const NotesModel =
  mongoose.models.notes || mongoose.model("notes", NotesSchema);
