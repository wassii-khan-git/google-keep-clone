import NoteCard from "@/components/ui/notes/note-card";

// Home Page
export default async function Home() {
  return (
    <div className="container mx-auto p-4 mt-10">
      {/* add note */}
      <NoteCard />
    </div>
  );
}
