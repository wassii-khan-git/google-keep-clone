"use client";

import React, { useState } from "react";
import AddNote from "./add-note";
import AllNotes from "./all-notes";
import { ToastContainer } from "react-toastify";
import { notify } from "@/lib/utils";
import { Note } from "@/models/tasks.model";

export interface ToggleHandlerProps {
  success?: boolean;
  data?: unknown;
}

const NoteCard = () => {
  // toggle
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // data state
  const [data, setData] = useState<Note | null>(null);
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
          setData(data as Note);
        }
      }
    }
    // log success state
    console.log(`success in toggle handler: ${success}`);
  };

  console.log("data in note card:", data);

  return (
    <>
      {/* note view */}
      {!isExpanded && (
        <div
          className="hover:border-gray-500 p-3 w-full md:w-[30rem] mx-auto border rounded-sm shadow cursor-pointer"
          onClick={() => ToggleHandler({})}
        >
          {/* title */}
          <label className="ml-2 text-gray-500 cursor-pointer font-semibold">
            Take a note
          </label>
        </div>
      )}
      {/* Add Note */}
      {isExpanded && <AddNote ToggleHandler={ToggleHandler} />}
      {/* All Notes */}
      <AllNotes data={data as Note} />
      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default NoteCard;
