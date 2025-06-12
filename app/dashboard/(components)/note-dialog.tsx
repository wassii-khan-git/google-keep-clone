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
import React from "react";

interface NoteDetailsDialogProps {
  title: string;
  description: string;
  trigger: React.ReactNode;
}

export default function NoteDetailsDialog({
  title,
  description,
  trigger,
}: NoteDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde
          nesciunt quia numquam optio ipsum maxime dolore? Incidunt sint commodi
          debitis at, sunt culpa aperiam maiores dolore ab magni odio
          voluptatum.
        </p>

        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
