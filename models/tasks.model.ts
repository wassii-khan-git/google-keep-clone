import mongoose, { Document, Schema, models } from "mongoose";

export interface INote extends Document {
  userId?: string;
  title?: string;
  note: string;
  isPinned?: boolean;
  isArchived?: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: {
      type: String,
      required: true,
    },
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
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent model recompilation in Next.js hot-reloading environments
const NotesModel = models.notes || mongoose.model<INote>("notes", NoteSchema);

export default NotesModel;
