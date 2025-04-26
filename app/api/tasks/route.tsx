import { NextResponse } from "next/server";
import DatabaseConnection from "../../lib/db";
import { NotesModel } from "../../models/tasks";

export async function GET() {
  try {
    await DatabaseConnection();
    const notes = await NotesModel.find();
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

export async function POST(request: Request) {
  try {
    await DatabaseConnection();
    const { title, note } = await request.json();
    const notesRecord = await NotesModel.create({ title, note });
    return NextResponse.json({ success: true, data: notesRecord });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
