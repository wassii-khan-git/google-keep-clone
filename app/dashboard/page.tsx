import Note from "@/components/ui/notes/note";

// Home Page
export default async function Home() {
  return (
    <div className="container mx-auto p-4 mt-10">
      {/* add note */}
      <Note />
    </div>
  );
}
