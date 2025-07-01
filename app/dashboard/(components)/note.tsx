"use client";

import React, { useState } from "react";
import TakeNote from "./note-input";
import AddNote from "./add-note";
import NoteList from "./note-list";
// import useNoteStore from "@/store/note-store";

const Note = () => {
  // toggle
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // toggle handler
  const NoteToggleHandler = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* note view */}
      {!isExpanded && <TakeNote NoteToggleHandler={NoteToggleHandler} />}
      {/* Add Note */}
      {isExpanded && <AddNote NoteToggleHandler={NoteToggleHandler} />}
      {/* All Notes */}
      <NoteList />
    </>
  );
};

export default Note;
