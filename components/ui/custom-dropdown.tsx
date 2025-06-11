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

interface DropdownMenuProps {
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
  menuitems,
  children,
  direction,
}: DropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* User Avatar */}
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={direction}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menuitems.map((item, index = 1) => (
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
              {/* Add separator after the last item */}
              {index === menuitems.length - 2 && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomDropdown;
