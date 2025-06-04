import React from "react";

interface TooltipButtonProps {
  idx?: number;
  icon: React.ReactNode;
  onClick: () => void;
  tooltipText?: string;
}

const TooltipButton = ({
  idx,
  icon,
  onClick,
  tooltipText,
}: TooltipButtonProps) => {
  return (
    <div className="relative group" key={idx}>
      <label
        className="hover:bg-gray-100 text-gray-500 px-3 py-2.5 rounded-full cursor-pointer"
        onClick={onClick}
      >
        {icon}
        {/* You can replace DeleteOutlined with any other icon */}
      </label>
      <div className="absolute left-1/2 -translate-x-1/2 mt-5 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {tooltipText}
      </div>
    </div>
  );
};

export default TooltipButton;
