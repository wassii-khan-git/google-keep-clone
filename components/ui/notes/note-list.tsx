"use client";

import React, { useEffect, useState } from "react";
import {
  LoadingOutlined,
  MoreOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import TooltipButton from "../common/custom-tooltip";
import { DeleteNote, GetAllNotes } from "@/lib/actions/notes.actions";
import { INote } from "@/models/tasks.model";
import { notify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Archive, UserPlus } from "lucide-react";
import EmptyNotes from "./empty-note";
import CustomDropdown from "../common/custom-dropdown";

interface NoteProps {
  data: INote;
}

const NoteList = ({ data }: NoteProps) => {
  // state to hold notes
  const [notes, setNotes] = useState<INote[]>([]);
  // loading
  const [loading, setLoading] = useState<boolean>(true);

  // fetch notes function
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await GetAllNotes();
      console.log(response);
      if (response.success) {
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
  const archiveNote = () => {
    notify({
      message: "Archive feature coming soon",
      flag: true,
    });
  };

  // Add collaborator function (placeholder)
  const addCollaborator = () => {
    notify({
      message: "Collaboration feature coming soon",
      flag: true,
    });
  };

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // If data is provided, add it to the notes
  useEffect(() => {
    if (data && data.note) {
      setNotes((prevNotes) => [...prevNotes, data]);
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
      isClickable: false,
      handleClick: () => archiveNote(),
    },
    {
      title: "Add Collaborator",
      icon: <UserPlus className="mr-2 h-4 w-4" />,
      isClickable: false,
      handleClick: () => addCollaborator(),
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
              <div className="note min-h-34 h-fit p-5 border border-gray-300 hover:border-gray-500 rounded-sm transition-colors duration-200 group">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 truncate pr-2">
                    {item.title || "Untitled Note"}
                  </h3>
                  <TooltipButton
                    icon={
                      <PushpinOutlined className="text-xl cursor-pointer text-gray-500 hover:text-gray-700" />
                    }
                    onClick={() =>
                      notify({ message: "Working on this feature", flag: true })
                    }
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
          ))
        ) : (
          <EmptyNotes />
        )}
      </div>
    </div>
  );
};

export default NoteList;
