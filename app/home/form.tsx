"use client";

import React, { useState } from "react";
import { CloseOutlined, PlusCircleOutlined } from "@ant-design/icons";
import TaskLists from "./table";
// Main from component

interface NotesProps {
  _id: string;
  title: string;
  note: string;
  createdAt: Date;
}

interface dataProps {
  title: string;
  note: string;
}

const Form = () => {
  // title
  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [data, setData] = useState<NotesProps | undefined>(undefined);

  const addNote = async (data: dataProps) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("I am response", response);
      const myData = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        setSuccess(true);
        setTitle("");
        setNote("");
        setData(myData.data);
      }
    } catch (error) {
      setSuccess(false);
      console.log("I am error", error);
    }
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      title,
      note,
    };
    await addNote(data);
  };

  return (
    <>
      <div className="">
        {success && (
          <h3 className="w-96 rounded-md mb-5 mx-auto p-3 text-center font-bold text-white bg-emerald-500">
            Record added successfully
            <CloseOutlined
              style={{ float: "right", marginTop: 3 }}
              onClick={() => setSuccess(false)}
            />
          </h3>
        )}
        <h3 className="font-medium mb-5 text-center text-2xl">Todo List</h3>
        <form
          className="flex justify-center items-center flex-col space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <input
              value={title}
              type="text"
              name="title"
              id="title"
              className="w-96 border border-black rounded-sm p-2"
              placeholder="Add a title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <textarea
              value={note}
              rows={5}
              name="Note"
              id="title"
              className="w-96 border border-black rounded-sm p-2"
              placeholder="Add a note"
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="bg-red-500">
            <button
              type="submit"
              className="w-96 float-left bg-indigo-500 text-white p-2 rounded-sm cursor-pointer"
            >
              <PlusCircleOutlined style={{ marginRight: 6 }} />
              Add
            </button>
          </div>
        </form>
      </div>
      <TaskLists success={success} note={data} />
    </>
  );
};

export default Form;
