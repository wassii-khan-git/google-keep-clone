"use client";

import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  LoadingOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import TooltipButton from "../custom-button";
import { DeleteNote, GetAllNotes } from "@/lib/actions";
import { Note } from "@/models/tasks.model";
import { notify } from "@/lib/utils";

interface NoteProps {
  data: Note;
}

const AllNotes = ({ data }: NoteProps) => {
  // state to hold notes
  const [notes, setNotes] = useState<Note[]>([]);
  // loading
  const [loading, setLoading] = useState<boolean>(true);

  // fetch notes function
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await GetAllNotes();
      console.log(response);
      if (response.success) {
        setNotes(response.data as Note[]);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Delte Note function
  const deleteNote = async (id: string) => {
    // Implement delete functionality here
    console.log(`Delete note with id: ${id}`);
    try {
      const response = await DeleteNote({ id });
      if (response.success) {
        // Notify the user about successful deletion
        notify({
          message: "Note deleted successfully",
          flag: true,
        });
        // Optionally, you can remove the note from the state
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

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // If data is provided, add it to the notes
  useEffect(() => {
    // If data is provided, add it to the notes
    if (data && data.note) {
      setNotes((prevNotes) => [...prevNotes, data]);
    }
  }, [data]);

  return (
    <div className="mx-auto p-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
        {/* Note list */}
        {loading ? (
          <div className="flex items-center justify-center col-span-4">
            <LoadingOutlined className="text-3xl text-yellow-500" />
          </div>
        ) : notes.length > 0 ? (
          notes.map((item, index = 1) => (
            <div
              key={index}
              className="p-3 mt-3 border border-gray-300 rounded-sm hover:border-gray-500"
            >
              {/* Example note item */}
              <div className="p-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{item.title}</h3>
                  <TooltipButton
                    icon={
                      <PushpinOutlined className="text-xl cursor-pointer" />
                    }
                    onClick={() =>
                      notify({ message: "Working on this feature", flag: true })
                    }
                    tooltipText="Pin Note"
                  />
                </div>
                <p className="text-gray-600 mt-3">
                  {item.note.split("\n").map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                {/* options section */}
                <div className="flex items-center justify-end mt-3">
                  <TooltipButton
                    icon={<DeleteOutlined />}
                    onClick={() => deleteNote(item._id as string)}
                    tooltipText="Delete Note"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <>No Notes Found</>
        )}
      </div>
    </div>
  );
};

export default AllNotes;
