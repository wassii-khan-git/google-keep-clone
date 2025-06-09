import React from "react";
import TooltipButton from "../common/custom-tooltip";
import { PictureOutlined } from "@ant-design/icons";
import { notify } from "@/lib/utils";

// Define the props for the TakeNote component
interface TakeNoteProps {
  ToggleHandler: (params: Record<string, unknown>) => void;
}

const TakeNote = ({ ToggleHandler }: TakeNoteProps) => {
  return (
    <div
      className="hover:border-gray-500 p-2.5 w-full md:w-[30rem] mx-auto border rounded-sm shadow cursor-pointer"
      onClick={() => ToggleHandler({})}
    >
      <div className="flex items-center justify-between ">
        {/* title */}
        <label className="ml-2 text-gray-500 cursor-pointer font-semibold">
          Take a note
        </label>
        <TooltipButton
          icon={<PictureOutlined className="text-xl" />}
          onClick={(e: React.MouseEvent) => {
            notify({
              message: "Add Image feature coming soon",
              flag: false,
            });
            e.stopPropagation();
          }}
          tooltipText="Take a note with image"
        />
      </div>
    </div>
  );
};

export default TakeNote;
