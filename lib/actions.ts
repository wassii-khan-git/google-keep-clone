"use server";

import NotesModel, { Note } from "@/models/tasks";
import DbConnect from "./db";
import { NoteSchemaValidation } from "./validator";

// create note payload interface
export interface CreateNotePayload {
  title?: string | null;
  note: string;
}
// Delete Note Payload interface
export interface DeleteNotePayload {
  id: string;
}
// create note payload return interface
export interface NotePayloadReturn {
  success: boolean;
  message: string;
  data?: Note[] | Note | null;
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
    const newNote = new NotesModel({ ...validation.data });
    // save the note to the database
    const savedNote = await newNote.save();

    return {
      success: true,
      message: "Note created successfully",
      data: JSON.parse(JSON.stringify(savedNote)) as Note[],
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
export const GetAllNotes = async (): Promise<NotePayloadReturn> => {
  try {
    // connect to the database
    await DbConnect();
    // get all notes from the database
    const notes = await NotesModel.find({}).sort({ createdAt: -1 });
    // return the notes
    return {
      success: true,
      message: "Notes fetched successfully",
      data: JSON.parse(JSON.stringify(notes)) as Note[],
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
      data: JSON.parse(JSON.stringify(note)) as Note,
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
