import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import { cn } from "@/lib/utils";
import AddNote from "./add-note";
import { INote } from "@/models/tasks.model";
import { useIsMobile } from "@/hooks/use-mobile";

interface NoteDetailsDialogProps {
  note: INote;
  trigger: React.ReactNode;
}

export default function NoteDetailsDialog({
  note,
  trigger,
}: NoteDetailsDialogProps) {
  // check if its the small screen
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn(`p-0 m-0 border-none`)}>
        <AddNote isNoteDialog={true} noteItem={note} />
      </DialogContent>
    </Dialog>
  );
}
