"use client";
import React, { useState } from "react";

interface TooltipButtonProps {
  idx?: number;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  tooltipText?: string;
}

const TooltipButton = ({
  idx,
  icon,
  onClick,
  tooltipText,
}: TooltipButtonProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return (
    <div
      className="relative"
      key={idx}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label
        className="hover:bg-gray-100 text-gray-500 px-3 py-2.5 rounded-full cursor-pointer"
        onClick={onClick}
      >
        {icon}
      </label>
      <div
        className={`absolute left-1/2 -translate-x-1/2 mt-5 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded ${
          isHovered ? "opacity-100" : "opacity-0"
        } transition-opacity pointer-events-none z-10`}
      >
        {tooltipText}
      </div>
    </div>
  );
};

export default TooltipButton;
