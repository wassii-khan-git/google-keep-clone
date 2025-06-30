"use client";
import React, { useState } from "react";

interface TooltipButtonProps {
  idx?: number;
  icon?: React.ReactNode;
  handleClick?: (e?: React.MouseEvent) => void;
  tooltipText?: string;
  isClickable: boolean;
}

const TooltipButton = ({
  idx,
  icon,
  handleClick,
  tooltipText,
  isClickable,
}: TooltipButtonProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  // display tooltip
  const displayToolTip =
    typeof tooltipText === "string" && tooltipText.length > 0;

  return (
    <div
      className={`relative `}
      key={idx}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label
        className={` ${
          idx !== 1 && isClickable
            ? "hover:bg-gray-200 hover:text-black cursor-pointer"
            : idx === 1 && isClickable
            ? "bg-none cursor-pointer"
            : "cursor-not-allowed hover:bg-none text-neutral-400"
        }  text-gray-500 inline-flex justify-center items-center p-3 rounded-full`}
        onClick={(e) => {
          if (isClickable && handleClick) {
            e.stopPropagation();
            handleClick(e);
          }
        }}
      >
        {icon}
      </label>
      {displayToolTip && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 mt-5 w-max px-2 py-1 hover:text-black bg-gray-800 text-white text-xs rounded ${
            isHovered ? "opacity-100" : "opacity-0"
          } transition-opacity pointer-events-none z-50`}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default TooltipButton;
