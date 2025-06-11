"use client";

import { notify } from "@/lib/utils";
import { INote } from "@/models/tasks.model";
import React, { useState } from "react";
import TakeNote from "./note-input";
import AddNote from "./add-note";
import NoteList from "./note-list";

export interface ToggleHandlerProps {
  success?: boolean;
  data?: unknown;
}

const Note = () => {
  // toggle
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // data state
  const [data, setData] = useState<INote | null>(null);
  // toggle handler
  const ToggleHandler = ({ success, data }: ToggleHandlerProps) => {
    setIsExpanded(!isExpanded);
    // if success is true, notify the user
    if (success) {
      notify({ message: "Note added successfully", flag: true });
      console.log("data", data);
      if (data) {
        // Type guard to ensure data is a Note before setting
        if (typeof data === "object" && data !== null && "title" in data) {
          setData(data as INote);
        }
      }
    }
    // log success state
    console.log(`success in toggle handler: ${success}`);
  };

  return (
    <>
      {/* note view */}
      {!isExpanded && <TakeNote ToggleHandler={ToggleHandler} />}
      {/* Add Note */}
      {isExpanded && <AddNote ToggleHandler={ToggleHandler} />}
      {/* All Notes */}
      <NoteList data={data as INote} />
    </>
  );
};

export default Note;
