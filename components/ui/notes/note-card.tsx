"use client";

import React, { useState } from "react";
import AddNote from "./add-note";

const NoteCard = () => {
  // toggle
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // toggle handler
  const ToggleHandler = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* note view */}
      {!isExpanded && (
        <div
          className="p-3 w-[30rem] border rounded-sm shadow cursor-pointer"
          onClick={ToggleHandler}
        >
          {/* title */}
          <label className="ml-2 text-gray-500 cursor-pointer font-semibold">
            Take a note
          </label>
        </div>
      )}
      {/* Add Note */}
      {isExpanded && <AddNote ToggleHandler={ToggleHandler} />}
    </>
  );
};

export default NoteCard;
