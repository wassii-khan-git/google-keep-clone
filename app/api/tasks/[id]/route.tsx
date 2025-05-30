import DatabaseConnection from "@/app/lib/db";
import { NotesModel } from "@/app/models/tasks";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  id: string;
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await params;

    console.log("i am params:", id);

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
