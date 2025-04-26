import React, { useState } from "react";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons"; // Make sure to install this package

interface Task {
  _id: string; // Added id field for key prop
  title: string; // Changed from 'title' to match your usage
  note: string; // Changed from 'title' to match your usage
  createdAt: Date;
}

interface DataTableProps {
  data: Task[];
  fetchRecord: () => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, fetchRecord }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  // handle Delete
  const handleDelete = async (id: string) => {
    console.log("I am clicked", id);
    try {
      const response = await fetch(`api/tasks/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      console.log("I am response", response);
      if (response.ok) {
        // Fetch data again after deletion
        setIsSuccess(true);
        fetchRecord();
      }
    } catch (error) {
      setIsSuccess(false);
      console.log("I am error", error);
    }
  };
  return (
    <>
      {isSuccess && (
        <h3 className="mt-5 w-96 rounded-md mb-5 mx-auto p-3 text-center font-bold text-white bg-emerald-500">
          Record added successfully
          <CloseOutlined
            style={{ float: "right", marginTop: 3 }}
            onClick={() => setIsSuccess(false)}
          />
          Record Deleted SuccessFully
        </h3>
      )}
      <div className="w-full md:max-w-[60%] mx-auto rounded-lg mt-16 border border-opacity-5 bg-base-100">
        <table className="table">
          <thead className="bg-gray-200">
            <tr>
              <th>Title</th>
              <th>Note</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.note}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="cursor-pointer rounded-full transition-all ease-in-out duration-300 hover:bg-red-200 px-2.5 py-2"
                  >
                    <DeleteOutlined style={{ color: "red" }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DataTable;
