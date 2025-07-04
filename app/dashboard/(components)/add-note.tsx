"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CreateNote,
  CreateNotePayload,
  DeleteFile,
  UpdateNote,
  UpdateNotePayload,
  UploadFile,
} from "@/lib/actions/notes.actions";
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
  Trash,
} from "lucide-react";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useNoteStore from "@/store/note-store";
import { notify } from "@/lib/utils";
import Image from "next/image";

interface NoteProps {
  NoteToggleHandler?: () => void;
  isNoteDialog?: boolean;
  noteItem?: INote; // Optional note prop for editing existing notes
}

const AddNote = ({ NoteToggleHandler, isNoteDialog, noteItem }: NoteProps) => {
  // title
  const [title, setTitle] = useState<string>(noteItem?.title || "");
  // note
  const [note, setNote] = useState<string>(noteItem?.note || "");
  // note prop state
  const [noteItemObj, setNoteItemObj] = useState<INote>(
    (noteItem as INote) || {}
  );
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
  // note store
  const { mutateNotes } = useNoteStore();
  // check if its the small screen

  // handle image upload
  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    const formData = new FormData();

    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      // if it contains any data
      if (target && target.files?.[0]) {
        // set the attributes
        formData.set("image", target.files?.[0]);
        try {
          const result = await UploadFile(formData);
          if (result.success) {
            toast.success("image uploaded successfully", {
              description: result?.data?.image,
            });
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "failed to upload"
          );
        }
      }
    };
    // add the click event
    input.click();
  }, []);

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

  const addNewNote = useCallback(
    async (obj: CreateNotePayload) => {
      try {
        const response = await CreateNote(obj);
        console.log("Response from CreateNote:", response);

        if (response.success) {
          // close the add note component
          NoteToggleHandler?.();
          // add the note the notes store
          mutateNotes(response.data as INote, false);
          // display the toast alert
          notify({ message: "Note added successfully", flag: true });
          // set fields empty
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
    },
    [NoteToggleHandler, mutateNotes]
  );

  const updateNote = useCallback(
    async (obj: UpdateNotePayload) => {
      try {
        const response = await UpdateNote(obj);
        console.log("Response from CreateNote:", response);

        if (response.success) {
          // close the add note component
          NoteToggleHandler?.();
          // add the note the notes store
          mutateNotes(response.data as INote, true);
          // display the toast alert
          notify({
            message: response.message || "Note updated successfully",
            flag: true,
          });
          // set fields empty
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
    },
    [mutateNotes, NoteToggleHandler]
  );

  // add update note
  const addUpdateNote = useCallback(async () => {
    if (!title.trim() && !note.trim()) {
      console.log("Note is empty");
      return;
    }
    const addObject = {
      title,
      note,
      userId: session?.data?.user?.id as string,
      isPinned: pinned as boolean,
      isArchived: isArchived as boolean,
    };

    if (!isNoteDialog) {
      await addNewNote(addObject);
    } else {
      if (isNoteDialog && noteItemObj) {
        const changed =
          title !== noteItemObj.title ||
          note !== noteItemObj.note ||
          pinned !== noteItemObj.isPinned ||
          isArchived !== noteItemObj.isArchived;
        if (changed) {
          const updateObject = {
            id: noteItemObj?._id as string,
            title,
            note,
            userId: session?.data?.user?.id as string,
            isPinned: pinned as boolean,
            isArchived: isArchived as boolean,
          };
          await updateNote(updateObject);
        }
      }
    }
  }, [
    isArchived,
    isNoteDialog,
    pinned,
    session.data?.user.id,
    addNewNote,
    updateNote,
    title,
    note,
    noteItemObj,
  ]);

  // clickaawy
  useEffect(() => {
    const clickAway = (e: Event) => {
      if (noteRef.current && !noteRef.current.contains(e.target as Node)) {
        console.log("Clicked outside the note area");
        addUpdateNote();
      }
    };
    document.addEventListener("mousedown", clickAway);
    return () => document.removeEventListener("mousedown", clickAway);
  }, [noteRef, addUpdateNote]);

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
      icon: <ImageIcon size={18} onClick={() => handleImageUpload()} />,
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

  return (
    <div
      ref={noteRef}
      className={`hover:border-gray-500 p-2 w-full ${
        !isNoteDialog && "w-full md:w-[600px] mx-auto"
      } border rounded-sm shadow `}
    >
      {isNoteDialog && noteItemObj ? (
        <DialogHeader>
          <DialogTitle>
            {noteItemObj?.image && (
              <>
                <Image
                  src={`/${noteItemObj?.image as string}`}
                  width={100}
                  height={100}
                  alt={noteItemObj?.image as string}
                  className="object-cover w-full"
                />
                <div className="mt-2 flex justify-end">
                  <TooltipButton
                    icon={<Trash size={18} />}
                    tooltipText="Delete image"
                    isClickable={true}
                    handleClick={async () => {
                      const response = await DeleteFile(
                        noteItemObj._id as string
                      );
                      if (response.success) {
                        toast.success(response.message);
                        // add the note the notes store
                        mutateNotes(response.data as INote, true);
                        setNoteItemObj(
                          (prev) =>
                            ({
                              ...(prev as INote),
                              image: "" as string,
                            } as INote)
                        );
                      } else {
                        toast.error(response.message);
                      }
                    }}
                  />
                </div>
              </>
            )}

            {/* note update */}
            <div
              className={`flex justify-between ${
                noteItemObj?.image && "border-t border-slate-200 mt-3"
              }`}
            >
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
        <div className="flex flex-wrap gap-0 sm:gap-2">
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
              <Button variant="outline" size="sm">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        ) : (
          <Button variant="outline" size="sm" onClick={NoteToggleHandler}>
            Close
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddNote;
