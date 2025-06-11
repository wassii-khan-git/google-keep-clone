"use client";

import { CloseOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CreateNote } from "@/lib/actions/notes.actions";
import { INote } from "@/models/tasks.model";
import { useSession } from "next-auth/react";
import TooltipButton from "@/components/ui/custom-tooltip";

interface CreateNoteResponse {
  success?: boolean;
  data?: INote;
}

interface NoteProps {
  ToggleHandler: ({ success, data }: CreateNoteResponse) => void;
}

const AddNote = ({ ToggleHandler }: NoteProps) => {
  // title
  const [title, setTitle] = useState<string>("");
  // note
  const [note, setNote] = useState<string>("");
  // note ref
  const noteRef = useRef<HTMLDivElement>(null);
  // input height
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // session
  const session = useSession();

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${Math.min(
        textAreaRef.current.scrollHeight,
        200 // max height in px
      )}px`;
    }
  };

  // add note
  const addNote = useCallback(async () => {
    if (!title.trim() && !note.trim()) {
      console.log("Note is empty");
      return;
    }
    const response = await CreateNote({
      title,
      note,
      userId: session?.data?.user?.id as string,
    });
    console.log("Response from CreateNote:", response);

    if (response.success) {
      ToggleHandler({ success: true, data: response.data as INote });
      setTitle("");
      setNote("");
    }
  }, [title, note, session, ToggleHandler]);

  // clickaawy
  useEffect(() => {
    const clickAway = (e: Event) => {
      if (noteRef.current && !noteRef.current.contains(e.target as Node)) {
        console.log("Clicked outside the note area");
        addNote();
      }
    };
    document.addEventListener("mousedown", clickAway);
    return () => document.removeEventListener("mousedown", clickAway);
  }, [noteRef, addNote]);

  return (
    <div
      ref={noteRef}
      className="hover:border-gray-500 p-3 w-full md:w-[30rem] mx-auto border rounded-sm shadow "
    >
      <div className="flex justify-between mt-2 mb-2">
        {/* title */}
        <input
          autoFocus={true}
          name="title"
          id="title"
          className="w-full resize-none border-none outline-none ml-2 font-semibold"
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        {/* close */}
        <TooltipButton
          idx={1}
          icon={<CloseOutlined />}
          onClick={() => ToggleHandler({ success: false })}
          tooltipText="Close Note"
        />
      </div>
      {/* details */}
      <textarea
        ref={textAreaRef}
        name="note"
        id="note"
        className="w-full text-gray-500 resize-none border-none outline-none ml-2 font-semibold"
        placeholder="Take a note"
        onChange={(e) => {
          setNote(e.target.value);
          adjustTextareaHeight();
        }}
      />
    </div>
  );
};

export default AddNote;
