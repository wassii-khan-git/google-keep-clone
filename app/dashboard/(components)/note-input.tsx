import React from "react";

import { CheckSquareOutlined, PictureOutlined } from "@ant-design/icons";
import TooltipButton from "@/components/ui/custom-tooltip";
import { toast } from "sonner";

// Define the props for the TakeNote component
interface TakeNoteProps {
  ToggleHandler: (params: Record<string, unknown>) => void;
}

const TakeNote = ({ ToggleHandler }: TakeNoteProps) => {
  return (
    <div
      className="hover:shadow-md p-2.5 ml-4 md:m-0 md:w-[26rem] md:mx-auto border rounded-sm cursor-pointer"
      onClick={() => ToggleHandler({})}
    >
      <div className="flex items-center justify-between ">
        {/* title */}
        <label className="ml-2 text-gray-500 cursor-pointer font-semibold">
          Take a note
        </label>

        {/* icons */}
        <div className="flex items-center">
          <TooltipButton
            idx={1}
            icon={<CheckSquareOutlined className="text-xl" />}
            tooltipText="Add checkbox"
            onClick={(e) => {
              e.stopPropagation();
              toast.error("This feature is not implemented yet.");
            }}
          />
          <TooltipButton
            idx={4}
            icon={<PictureOutlined className="text-xl" />}
            tooltipText="Add drawing"
            onClick={(e) => {
              e.stopPropagation();
              toast.error("This feature is not implemented yet.");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TakeNote;
