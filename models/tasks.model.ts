import mongoose, { Document, Schema, models } from "mongoose";

export interface INote extends Document {
  title?: string;
  note: string;
  isPinned?: boolean;
  isArchived?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      required: [true, "Content is required."],
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent model recompilation in Next.js hot-reloading environments
const NotesModel = models.notes || mongoose.model<INote>("notes", NoteSchema);

export default NotesModel;
