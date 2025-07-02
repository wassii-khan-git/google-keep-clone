import auth from "next-auth";
import NoteList from "../(components)/note-list";
import { authOptions } from "@/lib/auth";

export default async function ArchivesPage() {
  const session = auth(authOptions);
  console.log("session", session);

  return <NoteList />;
}
