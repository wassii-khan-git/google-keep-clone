import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import AddNote from "./add-note";

interface NoteDetailsDialogProps {
  title: string;
  description: string;
  trigger: React.ReactNode;
  onClose?: () => void;
}

export default function NoteDetailsDialog({
  title,
  description,
  trigger,
  onClose,
}: NoteDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-none m-0 p-0 w-full">
        {/* add note */}
        <div className="padding-0 m-0 w-full">
          <AddNote ToggleHandler={() => {}} isOpen={true} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
