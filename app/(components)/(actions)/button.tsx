import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import React from "react";

export const DeleteButton = () => {
  return (
    <button className="cursor-pointer rounded-full transition-all ease-in-out duration-300 hover:bg-red-200 px-2.5 py-2">
      <DeleteOutlined style={{ color: "red" }} />
    </button>
  );
};
export const AddButton = () => {
  return (
    <button className=" bg-indigo-500 text-white p-2 rounded-sm cursor-pointer">
      <PlusCircleOutlined style={{ marginRight: 6 }} />
      Add
    </button>
  );
};
