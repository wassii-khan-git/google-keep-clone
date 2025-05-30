"use client";

import { notify } from "@/lib/utils";
import { CloseCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";

interface NoteProps {
  ToggleHandler: () => void;
}

const AddNote = ({ ToggleHandler }: NoteProps) => {
  // title
  const [title, setTitle] = useState<string>("");
  // note
  const [note, setNote] = useState<string>("");
  // add note
  const addNote = async () => {
    if (!title || !note) {
      notify({ message: "Please add some note", flag: false });
    }
    // store the info
  };

  return (
    <div className="p-3 w-[30rem] border rounded-sm shadow ">
      <div className="flex justify-between mt-2 mb-5">
        {/* title */}
        <input
          name="title"
          id="title"
          className="w-full resize-none border-none outline-none ml-2 font-semibold"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* close */}
        <CloseCircleOutlined
          className=" text-gray-500 text-xl cursor-pointer"
          onClick={ToggleHandler}
        />
      </div>
      {/* details */}
      <textarea
        name="note"
        id="note"
        className="w-full text-gray-500 resize-none border-none outline-none ml-2 font-semibold"
        placeholder="Take a note"
        onChange={(e) => setNote(e.target.value)}
      />
    </div>
  );
};

export default AddNote;
