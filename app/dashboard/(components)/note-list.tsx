// NoteList.tsx - Updated with hover state management
"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircleFilled,
  LoadingOutlined,
  MoreOutlined,
  PushpinFilled,
  PushpinOutlined,
} from "@ant-design/icons";
import {
  ArchiveNote,
  DeleteNote,
  GetAllNotes,
  PinnedNote,
} from "@/lib/actions/notes.actions";
import { INote } from "@/models/tasks.model";
import { notify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Archive } from "lucide-react";
import EmptyNotes from "./empty-note";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import CustomDropdown, {
  MoreOperationsItem,
} from "@/components/ui/custom-dropdown";
import TooltipButton from "@/components/ui/custom-tooltip";
import NoteOptions from "./note-options";

interface NoteProps {
  data: INote;
}

const NoteList = ({ data }: NoteProps) => {
  // state to hold notes
  const [notes, setNotes] = useState<INote[]>([]);
  // state for pinned notes
  const [pinnedNotes, setPinnedNotes] = useState<INote[]>([]);
  // loading
  const [loading, setLoading] = useState<boolean>(true);
  // get the logged in user id
  const session = useSession();
  // more options clicked
  const [isMoreClicked, setIsMoreClicked] = useState<boolean>(false);
  // is note selected
  const [isNoteSelected, setIsNoteSelected] = useState<boolean>(false);
  // selected id
  const [selectedIds, setSelectedIds] = useState<Array<string>>([]);
  // Add hover state for each note
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  // Track dropdown open state for each note
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  // fetch notes function
  const fetchNotes = async (id: string) => {
    try {
      setLoading(true);
      const response = await GetAllNotes({
        userId: id,
        archive: false,
      });
      console.log(response);
      if (response.success) {
        const notesData = response.data as INote[];
        // filter out the unarchived and my notes
        setNotes(notesData.filter((note) => !note.isArchived));
        // set the filtered notes to the notes
        setPinnedNotes(notesData.filter((note) => note.isPinned));
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Delete Note function
  const deleteNote = async (id: string) => {
    console.log(`Delete note with id: ${id}`);
    try {
      const response = await DeleteNote({ id });
      if (response.success) {
        notify({
          message: "Note deleted successfully",
          flag: true,
        });
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
        setPinnedNotes((prevPinned) =>
          prevPinned.filter((note) => note._id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      notify({
        message: "Failed to delete note",
        flag: false,
      });
    }
  };

  // Copy note function
  const copyNote = async (note: INote) => {
    try {
      const textToCopy = `${note.title ? note.title + "\n\n" : ""}${note.note}`;
      await navigator.clipboard.writeText(textToCopy);
      notify({
        message: "Note copied to clipboard",
        flag: true,
      });
    } catch (error) {
      console.error("Error copying note:", error);
      notify({
        message: "Failed to copy note",
        flag: false,
      });
    }
  };

  // Archive note function
  const archiveNote = async (note: INote) => {
    try {
      const response = await ArchiveNote({
        noteId: note._id as string,
        userId: session?.data?.user.id as string,
      });
      if (response.success) {
        toast.success(response.message || "Note is archived");
        const filterNote = notes.filter((item) => item._id !== note._id);
        setNotes(filterNote);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Pin/Unpin note function
  const pinUnpinNote = async (note: INote, flag: boolean) => {
    try {
      const response = await PinnedNote({
        noteId: note._id as string,
        userId: session?.data?.user.id as string,
        flag,
      });
      if (response.success) {
        const noteObj = response.data as INote;
        if (noteObj.isPinned) {
          toast.success(response.message);
          setPinnedNotes((prevNotes) => [noteObj, ...prevNotes]);
          setNotes((prevNotes) =>
            prevNotes.filter((item) => item._id !== noteObj._id)
          );
        } else if (!noteObj.isPinned) {
          toast.success(response.message);
          setPinnedNotes((prevNotes) =>
            prevNotes.filter((item) => item._id !== noteObj._id)
          );
          setNotes((prevNotes) => [noteObj, ...prevNotes]);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Handle dropdown open/close
  const handleDropdownOpenChange = (noteId: string, isOpen: boolean) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(noteId);
      } else {
        newSet.delete(noteId);
      }
      return newSet;
    });
  };

  // Check if note should show hover effects
  const shouldShowHoverEffects = (noteId: string) => {
    return hoveredNoteId === noteId || openDropdowns.has(noteId);
  };

  // Fetch notes on component mount
  useEffect(() => {
    if (session.data?.user.id) {
      fetchNotes(session.data.user.id);
    }
  }, [session]);

  // If data is provided, add it to the notes
  useEffect(() => {
    if (data && data.note) {
      setNotes((prevNotes) => [data, ...prevNotes]);
    }
  }, [data]);

  // Menu items for each note - Fixed return type
  const menuitems = (item: INote): MoreOperationsItem[] => [
    {
      title: "Make a Copy",
      icon: <Copy className="mr-2 h-4 w-4" />,
      isClickable: true,
      handleClick: () => copyNote(item),
    },
    {
      title: "Archive",
      icon: <Archive className="mr-2 h-4 w-4" />,
      isClickable: true,
      handleClick: () => archiveNote(item),
    },
    {
      title: "Delete Note",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      isClickable: true,
      handleClick: () => deleteNote(item._id as string),
    },
  ];

  console.log(isNoteSelected);

  return (
    <div className="mx-auto p-5">
      {/* pinned note item */}
      {pinnedNotes.length > 0 && (
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Pinned</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        {pinnedNotes.map((item, index) => (
          <div
            key={index}
            className="md:w-[18rem] mb-16 note min-h-34 h-fit p-5 border border-gray-300 hover:border-gray-500 rounded-sm transition-colors duration-200"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 truncate pr-2">
                {item.title || "Untitled Note"}
              </h3>
              <TooltipButton
                icon={
                  <PushpinFilled className="text-xl cursor-pointer text-gray-500 hover:text-gray-700" />
                }
                onClick={() => pinUnpinNote(item as INote, false)}
                tooltipText="Unpin Note"
              />
            </div>

            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
              {item.note.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>

            <div className="flex items-center justify-end mt-3">
              <CustomDropdown menuitems={menuitems(item)} direction="start">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <MoreOutlined className="text-gray-500" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </CustomDropdown>
            </div>
          </div>
        ))}
      </div>

      {/* Note list */}
      {pinnedNotes.length > 0 && notes.length > 0 && (
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Others</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
        {loading ? (
          <div className="flex items-center justify-center col-span-4">
            <LoadingOutlined className="text-3xl text-yellow-500" />
          </div>
        ) : notes.length > 0 ? (
          notes.map((item, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredNoteId(item._id as string)}
              onMouseLeave={() => setHoveredNoteId(null)}
            >
              {/* Note item */}
              {!item.isPinned && (
                <div
                  className={`min-h-34 h-fit p-5 ${
                    selectedIds.includes(item._id as string)
                      ? "border border-black rounded-sm"
                      : "border-gray-300"
                  } border  hover:shadow-md rounded-sm transition-colors transition-border duration-300`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 truncate pr-2">
                      {item.title || "Untitled Note"}
                    </h3>
                    <div
                      className={`${
                        shouldShowHoverEffects(item._id as string)
                          ? "opacity-100"
                          : "opacity-0"
                      } transition-opacity`}
                    >
                      <TooltipButton
                        icon={
                          <PushpinOutlined className="cursor-pointer text-gray-500 hover:text-gray-700" />
                        }
                        onClick={() => pinUnpinNote(item as INote, true)}
                        tooltipText="Pin Note"
                      />
                    </div>
                  </div>

                  {/* Select icon  */}
                  <div
                    className={`absolute ${
                      !selectedIds.includes(item._id as string) &&
                      !shouldShowHoverEffects(item._id as string) &&
                      "opacity-0"
                    } ${
                      shouldShowHoverEffects(item._id as string)
                        ? "opacity-100"
                        : ""
                    } left-[-1.2rem] top-[-0.8rem] transition-opacity`}
                    onClick={() => {
                      setSelectedIds((prev) =>
                        prev.includes(item._id as string)
                          ? prev.filter((id) => id !== (item._id as string))
                          : [...prev, item._id as string]
                      );
                    }}
                  >
                    <TooltipButton
                      idx={1}
                      icon={<CheckCircleFilled className="text-xl" />}
                      tooltipText="Select note"
                    />
                  </div>

                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                    {item.note.split("\n").map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>

                  {/* Bottom icons */}
                  <NoteOptions
                    noteId={item._id as string}
                    setIsMoreClicked={setIsMoreClicked}
                    isMoreClicked={isMoreClicked}
                    moreOperationsItems={menuitems(item as INote)}
                    shouldShowHoverEffects={shouldShowHoverEffects(
                      item._id as string
                    )}
                    onDropdownOpenChange={(isOpen) =>
                      handleDropdownOpenChange(item._id as string, isOpen)
                    }
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          notes.length === 0 && pinnedNotes.length === 0 && <EmptyNotes />
        )}
      </div>
    </div>
  );
};

export default NoteList;
