import { Button } from "@/components/ui/button";
import CustomDropdown from "@/components/ui/custom-dropdown";
import TooltipButton from "@/components/ui/custom-tooltip";
import {
  BgColorsOutlined,
  FolderAddOutlined,
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
  menuitems?: () => {
    title: string;
    icon: React.ReactNode;
    isClickable: true;
    handleClick: () => Promise<void>;
  }[];
}

const NoteOptions = ({
  setIsMoreClicked,
  isMoreClicked,
  menuitems,
}: NoteOptionsProps) => {
  // note options menu items
  const bottomOptions = [
    {
      title: "More Options",
      icon: <MoreOutlined className=" text-gray-500" />,
      isClickable: false,
      isDropDown: true,
    },
    {
      title: "Archive Note",
      icon: <FolderAddOutlined />,
      isClickable: true,
      isDropDown: false,
    },
    {
      title: "Add Image",
      icon: <PictureOutlined />,
      isClickable: true,
      isDropDown: false,
    },
    {
      title: "Add Collaborator",
      icon: <UsergroupAddOutlined />,
      isClickable: true,
      isDropDown: false,
    },
    {
      title: "Add Reminder",
      icon: <NotificationOutlined />,
      isClickable: true,
      isDropDown: false,
    },
    {
      title: "Add Background",
      icon: <BgColorsOutlined />,
      isClickable: true,
      isDropDown: false,
    },
  ];
  return (
    <div className="flex items-center justify-end mt-5 gap-1 opacity-0 group-hover:opacity-100">
      {/* Background Options */}
      {bottomOptions.reverse().map((item, index) => (
        <React.Fragment key={index}>
          {item.isDropDown ? (
            <CustomDropdown
              menuitems={menuitems ? menuitems() : []}
              direction="start"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => setIsMoreClicked(!isMoreClicked)}
              >
                <TooltipButton
                  icon={<MoreOutlined className=" text-gray-500" />}
                  tooltipText={isMoreClicked ? "" : "Open menu"}
                />
              </Button>
            </CustomDropdown>
          ) : (
            <TooltipButton
              key={index}
              icon={item.icon}
              onClick={() =>
                toast.error("Add Background feature is not implemented yet")
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
