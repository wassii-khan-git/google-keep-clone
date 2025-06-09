"use client";

import React, { useEffect, useState } from "react";
import {
  LoadingOutlined,
  MoreOutlined,
  PushpinFilled,
  PushpinOutlined,
} from "@ant-design/icons";
import TooltipButton from "../common/custom-tooltip";
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
import CustomDropdown from "../common/custom-dropdown";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface NoteProps {
  data: INote;
}

const NoteList = ({ data }: NoteProps) => {
  // state to hold notes
  const [notes, setNotes] = useState<INote[]>([]);
  // state for filtered notes
  const [filteredNotes, setFilteredNotes] = useState<INote[]>(notes);
  // loading
  const [loading, setLoading] = useState<boolean>(true);
  // get the logged in user id
  const session = useSession();

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
        // filter out the unarchived and my notes
        setNotes(response.data as INote[]);
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

  // Archive note function (placeholder)
  const archiveNote = async (note: INote) => {
    try {
      const response = await ArchiveNote({
        noteId: note._id as string,
        userId: session?.data?.user.id as string,
      });
      if (response.success) {
        // display the alert
        toast.success(response.message || "Note is archived");
        // remove the archive note
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

  // Archive note function (placeholder)
  const pinUnpinNote = async (note: INote, flag: boolean) => {
    try {
      const response = await PinnedNote({
        noteId: note._id as string,
        userId: session?.data?.user.id as string,
        flag,
      });
      if (response.success) {
        // display the alert
        toast.success(response.message);
        // update the note state
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes(session.data?.user.id as string);
  }, [session]);

  // If data is provided, add it to the notes
  useEffect(() => {
    if (data && data.note) {
      setNotes((prevNotes) => [data, ...prevNotes]);
    }
  }, [data]);

  // Menu items for each note
  const menuitems = (item: INote) => [
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

  return (
    <div className="mx-auto p-5">
      {/* pinned note item */}
      {filteredNotes
        ?.filter((i) => i.isPinned)
        ?.map((item, index = 1) => (
          <div key={index} className="w-full block">
            <h6 className="mb-2 text-sm">Pinned</h6>
            <div className="mb-16 note min-h-34 h-fit p-5 border border-gray-300 hover:border-gray-500 rounded-sm transition-colors duration-200">
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
                    <MoreOutlined className="text-xl text-gray-500" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </CustomDropdown>
              </div>
            </div>
          </div>
        ))}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
        {/* Note list */}
        {loading ? (
          <div className="flex items-center justify-center col-span-4">
            <LoadingOutlined className="text-3xl text-yellow-500" />
          </div>
        ) : notes.length > 0 ? (
          notes.map((item, index) => (
            <div key={index}>
              {/* Note item */}
              {!item.isPinned && (
                <div className="note min-h-34 h-fit p-5 border border-gray-300 hover:border-gray-500 rounded-sm transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 truncate pr-2">
                      {item.title || "Untitled Note"}
                    </h3>
                    <TooltipButton
                      icon={
                        <PushpinOutlined className="text-xl cursor-pointer text-gray-500 hover:text-gray-700" />
                      }
                      onClick={() => pinUnpinNote(item as INote, true)}
                      tooltipText="Pin Note"
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
                    <CustomDropdown
                      menuitems={menuitems(item)}
                      direction="start"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <MoreOutlined className="text-xl text-gray-500" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </CustomDropdown>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <EmptyNotes />
        )}
      </div>
    </div>
  );
};

export default NoteList;
