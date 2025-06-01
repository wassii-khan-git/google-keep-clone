import { NextRequest, NextResponse } from "next/server";
import NotesModel from "@/models/tasks";
import DbConnect from "@/lib/db";

export async function GET() {
  try {
    await DbConnect();
    const notes = await NotesModel.find();
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

export async function POST(request: NextRequest) {
  try {
    await DbConnect();
    const { title, note } = await request.json();
    const notesRecord = await NotesModel.create({ title, note });
    return NextResponse.json({ success: true, data: notesRecord });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
