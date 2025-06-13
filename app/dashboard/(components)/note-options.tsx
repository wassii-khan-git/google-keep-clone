// NoteOptions.tsx - Updated component
import { Button } from "@/components/ui/button";
import CustomDropdown, {
  MoreOperationsItem,
} from "@/components/ui/custom-dropdown";
import TooltipButton from "@/components/ui/custom-tooltip";
import {
  BgColorsOutlined,
  MoreOutlined,
  NotificationOutlined,
  PictureOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import React from "react";
import { toast } from "sonner";

interface NoteOptionsProps {
  setIsMoreClicked: (value: boolean) => void;
  isMoreClicked: boolean;
  moreOperationsItems: MoreOperationsItem[];
  shouldShowHoverEffects: boolean;
  onDropdownOpenChange: (isOpen: boolean) => void;
}

const NoteOptions = ({
  setIsMoreClicked,
  isMoreClicked,
  moreOperationsItems,
  shouldShowHoverEffects,
  onDropdownOpenChange,
}: NoteOptionsProps) => {
  // note options menu items
  const bottomOptions = [
    {
      title: "More Options",
      icon: <MoreOutlined className="text-gray-500" />,
      isClickable: false,
      isDropDown: true,
      childs: moreOperationsItems,
    },
    {
      title: "Add Image",
      icon: <PictureOutlined />,
      isClickable: true,
      isDropDown: false,
      childs: [],
    },
    {
      title: "Add Collaborator",
      icon: <UsergroupAddOutlined />,
      isClickable: true,
      isDropDown: false,
      childs: [],
    },
    {
      title: "Add Reminder",
      icon: <NotificationOutlined />,
      isClickable: true,
      isDropDown: false,
      childs: [],
    },
    {
      title: "Add Background",
      icon: <BgColorsOutlined />,
      isClickable: true,
      isDropDown: false,
      childs: [],
    },
  ];

  return (
    <div
      className={`flex items-center justify-center gap-0 mt-5 md:gap-1 ${
        shouldShowHoverEffects ? "opacity-100" : "opacity-0"
      } transition-opacity`}
    >
      {bottomOptions.reverse().map((item, index) => (
        <React.Fragment key={index}>
          {item.isDropDown ? (
            <CustomDropdown
              menuitems={item.childs}
              direction="start"
              onOpenChange={onDropdownOpenChange}
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => setIsMoreClicked(!isMoreClicked)}
              >
                {item.icon}
              </Button>
            </CustomDropdown>
          ) : (
            <TooltipButton
              key={index}
              icon={item.icon}
              onClick={() =>
                toast.error(`${item.title} feature is not implemented yet`)
              }
              tooltipText={item.title}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NoteOptions;
