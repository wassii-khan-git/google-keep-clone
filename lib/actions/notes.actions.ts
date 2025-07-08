"use server";

import NotesModel, { INote } from "@/models/tasks.model";
import DbConnect from "../db";
import { NoteSchemaValidation } from "../validator";
import { revalidatePath } from "next/cache";
import { deleteFromBlob, uploadToBlob } from "../helper";

// create note payload interface
export interface CreateNotePayload {
  title?: string | null;
  note: string;
  userId: string;
  isPinned?: boolean;
  isArchived?: boolean;
  imageUrl?: string;
}
// Delete Note Payload interface
export interface DeleteNotePayload {
  id: string;
}
// create note payload return interface
export interface NotePayloadReturn {
  success: boolean;
  message: string;
  data?: INote[] | INote | null;
  flag?: boolean;
}
// update note payload interface
export interface UpdateNotePayload {
  id: string;
  userId: string;
  title?: string | null;
  note?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  imageUrl?: string;
}
// create note function
export const CreateNote = async (
  payload: CreateNotePayload
): Promise<NotePayloadReturn> => {
  // validate the payload
  const validation = NoteSchemaValidation.safeParse(payload);
  // if validation fails, return error
  if (!validation.success) {
    return { success: false, message: "Validation failed", data: null };
  }
  try {
    // connect to the database
    await DbConnect();
    // create a new note
    const newNote = new NotesModel({
      ...validation.data,
      userId: payload.userId.toString(),
      isPinned: payload.isPinned ? payload.isPinned : false,
      isArchived: payload.isArchived ? payload.isArchived : false,
    });
    // save the note to the database
    const savedNote = await newNote.save();

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Note created successfully",
      data: JSON.parse(JSON.stringify(savedNote)) as INote[],
    };
  } catch (error) {
    // if an error occurs, return the error message
    return {
      success: false,
      message: `Error creating note: ${error}`,
      data: null,
    };
  }
};
// create note function
export const UpdateNote = async (
  payload: UpdateNotePayload
): Promise<NotePayloadReturn> => {
  try {
    await DbConnect();

    // Build dynamic $set object based only on provided properties
    const updateFields: Partial<INote> = {};
    if (payload.title !== undefined && payload.title !== null)
      updateFields.title = payload.title;
    if (payload.note !== undefined) updateFields.note = payload.note;
    if (payload.isPinned !== undefined)
      updateFields.isPinned = payload.isPinned;
    if (payload.isArchived !== undefined)
      updateFields.isArchived = payload.isArchived;

    const updateDoc = Object.keys(updateFields).length
      ? { $set: updateFields }
      : {}; // no-op if nothing to set

    const updatedNote = await NotesModel.findOneAndUpdate(
      { _id: payload.id, userId: payload.userId },
      updateDoc,
      {
        new: true, // return the updated document
        runValidators: true, // enforce schema validation
      }
    );

    return {
      success: true,
      message: "Note updated successfully",
      data: updatedNote
        ? (JSON.parse(JSON.stringify(updatedNote)) as INote)
        : null,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error updating note: ${error}`,
      data: null,
    };
  }
};
// get all notes function
export const GetAllNotes = async ({
  userId,
  archive,
}: {
  userId?: string;
  archive?: boolean;
}): Promise<NotePayloadReturn> => {
  try {
    // connect to the database
    await DbConnect();
    // get all notes from the database
    const notes = await NotesModel.find({
      userId: userId,
      isArchived: archive,
    }).sort({
      updatedAt: -1,
    });
    // return the notes
    return {
      success: true,
      message: "Notes fetched successfully",
      data: JSON.parse(JSON.stringify(notes)) as INote[],
    };
  } catch (error) {
    // if an error occurs, return the error message
    return {
      success: false,
      message: `Error fetching notes: ${error}`,
      data: null,
    };
  }
};
// delete note function
export const DeleteNote = async ({
  id,
}: DeleteNotePayload): Promise<NotePayloadReturn> => {
  try {
    if (!id) {
      return { success: false, message: "ID is required", data: null };
    }
    // connect to the database
    await DbConnect();
    // delete the note from the database
    const note = await NotesModel.findByIdAndDelete({ _id: id });
    // if note is not found, return error
    if (!note) {
      return { success: false, message: "Note not found", data: null };
    }
    // TODO:- also delete the images associated with the notes

    // return success message
    return {
      success: true,
      message: "Note deleted successfully",
      data: JSON.parse(JSON.stringify(note)) as INote,
    };
  } catch (error) {
    // if an error occurs, return the error message
    return {
      success: false,
      message: `Error deleting note: ${error}`,
      data: null,
    };
  }
};
// set the note to archive
export const ArchiveNote = async ({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}): Promise<NotePayloadReturn> => {
  try {
    // find the note
    const note = await NotesModel.findOne({
      _id: noteId,
      userId,
    });
    // note
    if (!note) {
      return { success: false, message: "No note found against this userId" };
    }

    note.isArchived = true;

    await note.save();

    return {
      success: true,
      message: "Note archived successfully",
      data: JSON.parse(JSON.stringify(note)) as INote,
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        success: false,
        message: e.message,
      };
    }
    return {
      success: false,
      message: "Failed to archive the note",
    };
  }
};
// set the note to archive
export const PinnedNote = async ({
  noteId,
  userId,
  flag,
}: {
  noteId: string;
  userId: string;
  flag: boolean;
}): Promise<NotePayloadReturn> => {
  try {
    // find the note
    const note = await NotesModel.findOne({
      _id: noteId,
      userId,
    });
    // note
    if (!note) {
      return { success: false, message: "No note found against this userId" };
    }

    note.isPinned = flag;

    await note.save();

    return {
      success: true,
      message: `Note ${flag ? "Pinned" : "Unpinned"} successfully`,
      data: JSON.parse(JSON.stringify(note)) as INote,
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        success: false,
        message: e.message,
      };
    }
    return {
      success: false,
      message: "Failed to archive the note",
    };
  }
};
// Upload File
export const UploadFile = async (formData: FormData) => {
  const file = formData.get("image") as File;
  const noteId = formData.get("noteId") as string;
  if (!file) return { success: false, message: "file is required" };
  if (file.size > 4 * 1024 * 1024) {
    return { success: false, message: "File size should be less than 4MB" };
  }

  try {
    const url = await uploadToBlob(file);

    const note = await NotesModel.findByIdAndUpdate(
      noteId,
      { image: url },
      { new: true, runValidators: true }
    );
    if (!note) return { success: false, message: "Note not found" };

    return {
      success: true,
      message: "Uploaded!",
      data: JSON.parse(JSON.stringify(note)) as INote,
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to upload file",
    };
  }
};
// Delete File
export const DeleteFile = async (noteId: string) => {
  if (!noteId) return { success: false, message: "noteId required" };
  const note = await NotesModel.findById(noteId);
  if (!note) return { success: false, message: "Note not found" };
  if (!note.image) return { success: false, message: "No image on note" };

  const pathname = new URL(note.image).pathname; // e.g. '/myfile-abc123.png'

  try {
    const result = await deleteFromBlob(pathname);
    if (!result.ok) {
      return { success: false, message: "Failed to delete file from blob" };
    }

    const updated = await NotesModel.findByIdAndUpdate(
      noteId,
      { $unset: { image: "" } },
      { new: true, runValidators: true }
    );
    if (!updated) return { success: false, message: "Failed update" };

    return {
      success: true,
      message: "Deleted!",
      data: JSON.parse(JSON.stringify(updated)) as INote,
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to delete file",
    };
  }
};
