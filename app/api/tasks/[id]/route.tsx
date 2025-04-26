import DatabaseConnection from "@/app/lib/db";
import { NotesModel } from "@/app/models/tasks";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log("I am params", id);

    if (!id) {
      return NextResponse.json({ success: false, error: "Id is required" });
    }
    await DatabaseConnection();
    const notes = await NotesModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
