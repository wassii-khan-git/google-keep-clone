// types.ts - Create a shared types file
export interface MoreOperationsItem {
  title: string;
  icon: React.ReactNode;
  isClickable: boolean;
  handleClick: () => void;
}

export interface DropdownMenuItem {
  title: string;
  icon?: React.ReactNode;
  isClickable?: boolean;
  handleClick?: () => void;
}

// CustomDropdown.tsx - Updated component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

interface CustomDropdownProps {
  title?: string;
  menuitems: {
    title: string;
    icon?: React.ReactNode;
    isClickable?: boolean;
    handleClick?: () => void;
  }[];
  children?: React.ReactNode;
  direction: "center" | "start" | "end";
}

const CustomDropdown = ({
  title,
  menuitems,
  children,
  direction,
}: CustomDropdownProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={direction}>
        {title && (
          <>
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          {menuitems.map((item, index) => (
            <React.Fragment key={index}>
              <DropdownMenuItem
                onClick={() => item.isClickable && item.handleClick?.()}
                className={`${
                  item.isClickable ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </DropdownMenuItem>
              {/* Add separator after the second-to-last item */}
              {index === menuitems.length - 2 && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomDropdown;
