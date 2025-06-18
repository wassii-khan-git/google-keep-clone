"use server";

import NotesModel, { INote } from "@/models/tasks.model";
import DbConnect from "../db";
import { NoteSchemaValidation } from "../validator";

// create note payload interface
export interface CreateNotePayload {
  title?: string | null;
  note: string;
  userId: string;
  isPinned?: boolean;
  isArchived?: boolean;
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
  title?: string | null;
  note: string;
  isPinned?: boolean;
  isArchived?: boolean;
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
    });
    // save the note to the database
    const savedNote = await newNote.save();

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
      createdAt: -1,
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
