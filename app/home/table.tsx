"use client";

import React, { useState, useEffect } from "react";
import DataTable from "../(components)/data-table";

interface Task {
  success: boolean;
}

const TaskLists = (success: Task) => {
  const [data, setData] = useState([]);
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
      console.log("I am response", response);

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
  }, [success]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DataTable data={data} fetchRecord={fetchData} />
    </>
  );
};

export default TaskLists;
