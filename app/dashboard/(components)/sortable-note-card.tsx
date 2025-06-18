import { MoreOperationsItem } from "@/components/ui/custom-dropdown";
import { INote } from "@/models/tasks.model";
import { useSortable } from "@dnd-kit/sortable";
import NoteCard from "./card";
import { Transition } from "@dnd-kit/utilities";

interface SortableNoteCardProps {
  id: string; // The dnd-kit id (should be note._id)
  item: INote; // The actual note object
  selectedIds: string[];
  shouldShowHoverEffects: (noteId: string) => boolean;
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  setIsMoreClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isMoreClicked: boolean;
  menuitems: (item: INote) => MoreOperationsItem[];
  handleDropdownOpenChange: (id: string, isOpen: boolean) => Set<string>;
  pinUnpinNote: (note: INote, isPinned: boolean) => void;
  onMouseEnter: (noteId: string) => void;
  onMouseLeave: (noteId: string) => void;
}

export default function SortableNoteCard({
  id,
  item,
  ...rest // Spread all other props
}: SortableNoteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id }); // Use the unique ID for sortable item

  return (
    // Apply touch-action-none to prevent default browser touch behaviors like scrolling
    // on the draggable element, which is crucial for smooth mobile dragging.
    <div className="touch-action-none">
      <NoteCard
        ref={setNodeRef} // Attach the ref for dnd-kit
        transform={transform} // Pass dnd-kit's transform
        transition={transition as unknown as Transition} // Pass dnd-kit's transition cast to Transition type
        attributes={attributes} // Pass dnd-kit attributes
        listeners={listeners} // Pass dnd-kit listeners
        isDragging={isDragging} // Pass dnd-kit isDragging state
        item={item}
        {...rest} // Pass all other props
      />
    </div>
  );
}
