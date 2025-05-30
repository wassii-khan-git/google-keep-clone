"use client";

import React, { useState, useEffect } from "react";
import DataTable from "../(components)/data-table";

interface NotesProps {
  _id: string;
  title: string;
  note: string;
  createdAt: Date;
}

interface Task {
  success: boolean;
  note?: NotesProps;
}

const TaskLists = ({ success, note }: Task) => {
  const [data, setData] = useState<NotesProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("i am notes", note);
    if (note) {
      setData((prev) => [...prev, note]);
    }
  }, [note]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  console.log("data", data);

  console.log("i am success", success);

  return (
    <>
      <DataTable data={data} fetchRecord={fetchData} />
    </>
  );
};

export default TaskLists;
