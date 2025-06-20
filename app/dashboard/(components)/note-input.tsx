import React from "react";
import { toast } from "sonner";
import { Brush, ImageIcon, SquareCheck } from "lucide-react";
import TooltipButton from "@/components/ui/custom-tooltip";

// Define the props for the TakeNote component
interface TakeNoteProps {
  ToggleHandler: (params: Record<string, unknown>) => void;
}

const TakeNote = ({ ToggleHandler }: TakeNoteProps) => {
  return (
    <div
      className="hover:border-gray-500 ml-4 md:m-0 md:w-[600px] md:mx-auto border rounded-sm cursor-pointer"
      onClick={() => ToggleHandler({})}
    >
      <div className="flex items-center justify-between ">
        {/* title */}
        <label className=" text-gray-500 ml-4 cursor-pointer font-semibold">
          Take a note
        </label>

        {/* icons */}
        <div className="flex items-center">
          <TooltipButton
            icon={<SquareCheck size={20} />}
            tooltipText="Add checkbox"
            handleClick={(e) => {
              e.stopPropagation();
              toast.error("This feature is not implemented yet.");
            }}
            isClickable={true}
          />
          <TooltipButton
            icon={<Brush size={20} />}
            tooltipText="new note with drawing"
            handleClick={(e) => {
              e.stopPropagation();
              toast.error("New note with drawing");
            }}
            isClickable={true}
          />

          <TooltipButton
            icon={<ImageIcon size={20} />}
            tooltipText="Add drawing"
            handleClick={(e) => {
              e.stopPropagation();
              toast.error("This feature is not implemented yet.");
            }}
            isClickable={true}
          />
        </div>
      </div>
    </div>
  );
};

export default TakeNote;
