"use client";

import React, { Dispatch, SetStateAction } from "react";
import TooltipButton from "@/components/ui/custom-tooltip";
import { INote } from "@/models/tasks.model";
import { CheckCircleFilled } from "@ant-design/icons";
import type { Transform, Transition } from "@dnd-kit/utilities"; // Only need Transform here
import NoteOptions from "./note-options";
import { CSS } from "@dnd-kit/utilities"; // Import CSS for transform conversion
import { PinIcon, PinOff } from "lucide-react";
import { MenuItemsProps } from "@/components/ui/custom-dropdown";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

interface NoteCardProps {
  selectedIds: string[];
  item: INote;
  shouldShowHoverEffects: (noteId: string) => boolean;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  setIsMoreClicked: Dispatch<SetStateAction<boolean>>;
  isMoreClicked: boolean;
  menuitems: (item: INote) => MenuItemsProps[];
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
  content?: string;
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
        content,
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

      const isMobile = useIsMobile();

      return (
        <div
          ref={ref}
          {...attributes}
          {...listeners}
          style={dndStyle} // Apply dnd-kit controlled styles here
          onMouseEnter={() => onMouseEnter(item._id as string)}
          onMouseLeave={() => onMouseLeave(item._id as string)}
          className={`
             h-fit  border rounded-sm relative
            ${
              isSelected
                ? "border-black"
                : "border-gray-300 hover:border-gray-500"
            }
            hover:shadow-md transition-colors duration-300
            ${isDragging ? "cursor-grabbing" : "cursor-grab"}
          `}
        >
          {item.image && (
            <div className="flex items-center border-b border-slate-200">
              {/* image */}
              <Image
                src={`/${item?.image as string}`}
                width={100}
                height={100}
                alt={item?.image as string}
                className="w-full object-cover p-1"
              />
            </div>
          )}

          <div className="px-4 py-1.5">
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
                    content === "notes" ? (
                      <PinIcon size={18} />
                    ) : (
                      <PinOff size={18} />
                    )
                  }
                  handleClick={() =>
                    pinUnpinNote(
                      item as INote,
                      content === "notes" ? true : false
                    )
                  }
                  tooltipText={content === "notes" ? "pin note" : "unpin note"}
                  isClickable={true}
                />
              </div>
            </div>

            {/* Select icon - positioned absolutely */}
            <div
              className={`absolute z-10
              ${showHover || isSelected ? "opacity-100" : "opacity-0"}
              left-[-1.2rem] top-[-1.2rem] transition-opacity duration-200 cursor-pointer
            `}
              onClick={(e) => {
                e?.stopPropagation();
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
                isClickable={true}
              />
            </div>

            {/* Note content */}
            <p className="text-gray-600 text-sm">
              {item.note.split("\n").map((line: string, idx: number) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
          {/* Bottom icons (More options) */}
          <div className="mb-1.5">
            {!isMobile && (
              <NoteOptions
                setIsMoreClicked={setIsMoreClicked}
                menuItemsProps={menuitems(item as INote)}
                shouldShowHoverEffects={showHover}
                onDropdownOpenChange={(isOpen) =>
                  handleDropdownOpenChange(item._id as string, isOpen)
                }
              />
            )}
          </div>
        </div>
      );
    }
  )
);

NoteCard.displayName = "NoteCard";
export default NoteCard;
