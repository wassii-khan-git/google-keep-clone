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

export interface MenuChildsProps {
  title: string;
  icon?: React.ReactNode;
  isClickable: boolean;
  handleClick: () => void;
}

export interface MenuItemsProps {
  title: string;
  icon?: React.ReactNode;
  isClickable: boolean;
  handleClick: () => void;
  childs: MenuChildsProps[];
}

interface CustomDropdownProps {
  title?: string;
  menuitems: MenuChildsProps[];
  children?: React.ReactNode;
  direction: "center" | "start" | "end";
  onOpenChange?: (isOpen: boolean) => void;
}

const CustomDropdown = ({
  title,
  menuitems,
  children,
  direction,
  onOpenChange,
}: CustomDropdownProps) => {
  return (
    <DropdownMenu modal={false} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={direction}>
        {title && (
          <React.Fragment>
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </React.Fragment>
        )}
        <DropdownMenuGroup>
          {menuitems.map((item, index) => (
            <React.Fragment key={index}>
              <DropdownMenuItem
                onClick={(e) => {
                  if (item?.isClickable) {
                    e?.stopPropagation();
                    item?.handleClick?.();
                  }
                }}
                className={`${
                  item?.isClickable ? "cursor-pointer" : "cursor-not-allowed"
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
