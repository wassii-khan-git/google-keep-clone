import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import AddNote from "./add-note";
import { INote } from "@/models/tasks.model";

interface NoteDetailsDialogProps {
  note: INote;
  trigger: React.ReactNode;
}

export default function NoteDetailsDialog({
  note,
  trigger,
}: NoteDetailsDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn(`p-0 m-0 border-none`)}>
        <AddNote
          isNoteDialog={true}
          noteItem={note}
          NoteToggleHandler={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
