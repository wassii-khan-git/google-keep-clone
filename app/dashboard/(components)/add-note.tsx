"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CreateNote } from "@/lib/actions/notes.actions";
import { INote } from "@/models/tasks.model";
import { useSession } from "next-auth/react";
import TooltipButton from "@/components/ui/custom-tooltip";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Type,
  Pin,
  PinOff,
  Bold,
  Italic,
  Palette,
  BellPlus,
  ImageIcon,
  FolderDown,
  FolderUp,
  Heading1,
  Heading2,
  UserPlus,
  CornerDownLeft,
  CornerDownRight,
} from "lucide-react";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateNoteResponse {
  success?: boolean;
  data?: INote;
}

interface NoteProps {
  ToggleHandler: ({ success, data }: CreateNoteResponse) => void;
  isNoteDialog?: boolean;
  noteItem?: INote; // Optional note prop for editing existing notes
}

const AddNote = ({ ToggleHandler, isNoteDialog, noteItem }: NoteProps) => {
  // title
  const [title, setTitle] = useState<string>(noteItem?.title || "");
  // note
  const [note, setNote] = useState<string>(noteItem?.note || "");
  // note ref
  const noteRef = useRef<HTMLDivElement>(null);
  // input height
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // session
  const session = useSession();
  // pinned
  const [pinned, setIsPinned] = useState<boolean>(false);
  // is archived
  const [isArchived, setIsArchived] = useState<boolean>(false);

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
    const obj = {
      title,
      note,
      userId: session?.data?.user?.id as string,
      isPinned: pinned as boolean,
      isArchived: isArchived as boolean,
    };
    console.log("i am add note obj", obj);

    try {
      const response = await CreateNote(obj);
      console.log("Response from CreateNote:", response);

      if (response.success) {
        ToggleHandler({ success: true, data: response.data as INote });
        setTitle("");
        setNote("");
        setIsPinned(false);
        setIsArchived(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }, [title, note, session, ToggleHandler, isArchived, pinned]);

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

  const bottomIcons = [
    {
      icon: <Type size={18} />,
      text: "Formatting options",
      isClickable: false,
      handleClick: () => toast.error("text formating is clicked"),
      child: [
        {
          icon: <Heading1 size={18} />,
          text: "Heading 1",
          isClickable: false,
          handleClick: () => toast.error("H1"),
        },
        {
          icon: <Heading2 size={18} />,
          text: "Heading 2",
          isClickable: false,
          handleClick: () => toast.error("H2"),
        },
        {
          icon: <Bold size={18} />,
          text: "Bold",
          isClickable: false,
          handleClick: () => toast.error("Bold"),
        },
        {
          icon: <Italic size={18} />,
          text: "italic",
          isClickable: false,
          handleClick: () => toast.error("italic"),
        },
      ],
    },
    {
      icon: <Palette size={18} />,
      text: "Background Options",
      isClickable: true,
      handleClick: () => toast.error("background options"),
    },
    {
      icon: <BellPlus size={18} />,
      text: "Remind me",
      isClickable: true,
      handleClick: () => toast.error("Remind me"),
    },
    {
      icon: <UserPlus size={18} />,
      text: "Add collaborator",
      isClickable: true,
      handleClick: () => toast.error("Add collaborator"),
    },
    {
      icon: <ImageIcon size={18} />,
      text: "Add Image",
      isClickable: true,
      handleClick: () => toast.error("Add Image"),
    },
    {
      icon: !isArchived ? <FolderDown size={18} /> : <FolderUp size={18} />,
      text: "archive",
      isClickable: true,
      handleClick: () => setIsArchived((prev) => !prev),
    },
    {
      icon: <CornerDownLeft size={18} />,
      text: "Undo",
      isClickable: false,
      handleClick: () => toast.error("Undo"),
    },
    {
      icon: <CornerDownRight size={18} />,
      text: "Redo",
      isClickable: false,
      handleClick: () => toast.error("Redo"),
    },
  ];
  console.log(note);

  return (
    <div
      ref={noteRef}
      className={`hover:border-gray-500 p-2 w-full ${
        !isNoteDialog && "md:w-[600px] mx-auto"
      } border rounded-sm shadow `}
    >
      {isNoteDialog ? (
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-between">
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
                value={title}
              />
              {/* bell outline */}
              <TooltipButton
                icon={!pinned ? <Pin size={18} /> : <PinOff size={18} />}
                handleClick={() => setIsPinned((prev) => !prev)}
                tooltipText="pinunpinNote"
                isClickable={true}
              />
            </div>
          </DialogTitle>
        </DialogHeader>
      ) : (
        <div className="flex justify-between">
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
            value={title}
          />
          {/* bell outline */}
          <TooltipButton
            icon={!pinned ? <Pin size={18} /> : <PinOff size={18} />}
            handleClick={() => setIsPinned((prev) => !prev)}
            tooltipText="pinunpinNote"
            isClickable={true}
          />
        </div>
      )}

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
        value={note}
      />
      {/* Updated At Info */}
      {isNoteDialog && (
        <div className="flex justify-end font-semibold items-center mb-3 mr-2 text-[0.7rem] text-gray-600 mt-1">
          Edited at{" "}
          {new Date().toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}

      {/* note options */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {bottomIcons.map((item, index) => (
            <TooltipButton
              key={index}
              icon={item.icon}
              tooltipText={item.text}
              handleClick={() => item?.handleClick()}
              isClickable={item.isClickable}
            />
          ))}
        </div>
        {isNoteDialog ? (
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => ToggleHandler({ success: false })}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => ToggleHandler({ success: false })}
          >
            Close
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddNote;
