"use client";

import React, { Dispatch, SetStateAction } from "react";
import TooltipButton from "@/components/ui/custom-tooltip";
import { INote } from "@/models/tasks.model";
import { CheckCircleFilled, PushpinOutlined } from "@ant-design/icons";
import type { Transform, Transition } from "@dnd-kit/utilities"; // Only need Transform here
import NoteOptions from "./note-options";
import { MoreOperationsItem } from "@/components/ui/custom-dropdown";
import { CSS } from "@dnd-kit/utilities"; // Import CSS for transform conversion

interface NoteCardProps {
  selectedIds: string[];
  item: INote;
  shouldShowHoverEffects: (noteId: string) => boolean;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  setIsMoreClicked: Dispatch<SetStateAction<boolean>>;
  isMoreClicked: boolean;
  menuitems: (item: INote) => MoreOperationsItem[];
  handleDropdownOpenChange: (id: string, isOpen: boolean) => Set<string>;
  pinUnpinNote: (note: INote, isPinned: boolean) => void;
  onMouseEnter: (noteId: string) => void;
  onMouseLeave: (noteId: string) => void;

  // Dnd-kit specific props
  transform?: Transform | null;
  transition?: Transition | undefined;
  attributes?: React.HTMLAttributes<HTMLDivElement>;
  listeners?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean; // Indicates if this specific card is being dragged
}

const NoteCard = React.memo(
  React.forwardRef<HTMLDivElement, NoteCardProps>(
    (
      {
        selectedIds,
        item,
        shouldShowHoverEffects,
        setSelectedIds,
        setIsMoreClicked,
        isMoreClicked,
        pinUnpinNote,
        handleDropdownOpenChange,
        menuitems,
        onMouseEnter,
        onMouseLeave,
        transition,
        transform,
        attributes,
        listeners,
        isDragging, // Use this prop for drag-specific styling
      },
      ref
    ) => {
      const showHover = shouldShowHoverEffects(item._id as string);
      const isSelected = selectedIds.includes(item._id as string);

      // Consolidate dnd-kit controlled styles
      const dndStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform as Transform),
        transition: transition ? String(transition) : undefined,
        // Apply zIndex and opacity only when dragging for visual feedback
        zIndex: isDragging ? 10 : undefined, // Higher z-index when dragged
        opacity: isDragging ? 0.8 : 1, // Slight transparency when dragged
        // Hint the browser for performance, only when actively dragging
        willChange: isDragging ? "transform, opacity" : "auto",
      };

      return (
        <div
          ref={ref}
          {...attributes}
          {...listeners}
          style={dndStyle} // Apply dnd-kit controlled styles here
          onMouseEnter={() => onMouseEnter(item._id as string)}
          onMouseLeave={() => onMouseLeave(item._id as string)}
          className={`
            min-h-34 h-fit p-5 border rounded-sm relative
            ${
              isSelected
                ? "border-black"
                : "border-gray-300 hover:border-gray-500"
            }
            hover:shadow-md transition-colors duration-300
            ${isDragging ? "cursor-grabbing" : "cursor-grab"}
          `}
        >
          {/* Top section: Title and Pin Icon */}
          <div className="flex justify-between items-center relative">
            <h3 className="font-semibold text-gray-800 truncate pr-2">
              {item.title || "Untitled Note"}
            </h3>
            <div
              className={`${
                showHover ? "opacity-100" : "opacity-0"
              } transition-opacity duration-200`}
            >
              <TooltipButton
                icon={
                  <PushpinOutlined className="cursor-pointer text-gray-500 hover:text-gray-700" />
                }
                onClick={() => pinUnpinNote(item as INote, true)}
                tooltipText="Pin Note"
              />
            </div>
          </div>

          {/* Select icon - positioned absolutely */}
          <div
            className={`absolute z-10
              ${showHover || isSelected ? "opacity-100" : "opacity-0"}
              left-[-1.2rem] top-[-0.8rem] transition-opacity duration-200 cursor-pointer
            `}
            onClick={() => {
              setSelectedIds((prev: string[]) =>
                prev.includes(item._id as string)
                  ? prev.filter((id: string) => id !== item._id)
                  : [...prev, item._id as string]
              );
            }}
          >
            <TooltipButton
              idx={1}
              icon={<CheckCircleFilled className="text-xl" />}
              tooltipText="Select note"
            />
          </div>

          {/* Note content */}
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            {item.note.split("\n").map((line: string, idx: number) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </p>

          {/* Bottom icons (More options) */}
          <NoteOptions
            setIsMoreClicked={setIsMoreClicked}
            isMoreClicked={isMoreClicked}
            moreOperationsItems={menuitems(item as INote)}
            shouldShowHoverEffects={showHover}
            onDropdownOpenChange={(isOpen) =>
              handleDropdownOpenChange(item._id as string, isOpen)
            }
          />
        </div>
      );
    }
  )
);

NoteCard.displayName = "NoteCard";
export default NoteCard;
