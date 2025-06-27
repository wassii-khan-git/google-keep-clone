import React, { SetStateAction, useCallback } from "react";
import { MoreVerticalIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
import CustomDropdown, {
  MenuItemsProps,
  MenuChildsProps,
} from "@/components/ui/custom-dropdown";
import TooltipButton from "@/components/ui/custom-tooltip";
import { Button } from "@/components/ui/button";
// import { Button } from "@/components/ui/button";

interface NoteOptionsProps {
  setIsMoreClicked: React.Dispatch<SetStateAction<boolean>>;
  isMoreClicked?: boolean;
  menuItemsProps: MenuItemsProps[];
  shouldShowHoverEffects: boolean;
  onDropdownOpenChange: (isOpen: boolean) => void;
}

const NoteOptions = ({
  setIsMoreClicked,
  // isMoreClicked,
  menuItemsProps,
  shouldShowHoverEffects,
  onDropdownOpenChange,
}: NoteOptionsProps) => {
  // render dropdown component
  const renderDropDownComponent = useCallback(
    (item: MenuChildsProps[]) => (
      <CustomDropdown
        menuitems={item}
        direction="start"
        onOpenChange={onDropdownOpenChange}
      >
        <Button
          variant="outline"
          className="h-8 w-8 rounded-full ml-2"
          onClick={() => setIsMoreClicked((prev) => !prev)}
          title="More options"
        >
          {<MoreVerticalIcon />}
        </Button>
      </CustomDropdown>
    ),
    [onDropdownOpenChange, setIsMoreClicked]
  );

  return (
    <div
      className={`flex items-center justify-center mt-5 ${
        shouldShowHoverEffects ? "opacity-100" : "opacity-0"
      } transition-opacity`}
    >
      {[...menuItemsProps].reverse().map((item, index) => (
        <React.Fragment key={index}>
          {item.childs?.length > 0 ? (
            renderDropDownComponent(item.childs)
          ) : (
            <TooltipButton
              icon={item.icon}
              handleClick={item?.handleClick ?? item?.handleClick()}
              tooltipText={item.title}
              isClickable={item.isClickable}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NoteOptions;
