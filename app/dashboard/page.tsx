"use client";
import Note from "@/components/ui/notes/note";

// Home Page
export default function Home() {
  return (
    <div className="container mx-auto p-4 mt-10">
      {/* add note */}
      <Note />
    </div>
  );
}
