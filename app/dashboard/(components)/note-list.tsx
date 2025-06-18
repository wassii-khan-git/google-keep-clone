"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircleFilled,
  LoadingOutlined,
  PushpinFilled,
} from "@ant-design/icons";
import {
  ArchiveNote,
  DeleteNote,
  GetAllNotes,
  PinnedNote,
} from "@/lib/actions/notes.actions";
import { INote } from "@/models/tasks.model";
import { notify } from "@/lib/utils";
import { Trash2, Copy, Archive } from "lucide-react";
import EmptyNotes from "./empty-note";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { MoreOperationsItem } from "@/components/ui/custom-dropdown";
import TooltipButton from "@/components/ui/custom-tooltip";
import NoteOptions from "./note-options";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SortableNoteCard from "./sortable-note-card";

interface NoteProps {
  data: INote;
}

const NoteList = ({ data }: NoteProps) => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [pinnedNotes, setPinnedNotes] = useState<INote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const session = useSession();
  const [isMoreClicked, setIsMoreClicked] = useState<boolean>(false); // Consider if this is truly needed at global level or can be local to NoteCard
  const [selectedIds, setSelectedIds] = useState<Array<string>>([]);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const fetchNotes = async (id: string) => {
    setLoading(true);
    try {
      const response = await GetAllNotes({
        userId: id,
        archive: false,
      });
      if (response.success) {
        const notesData = response.data as INote[];
        setNotes(
          notesData.filter((note) => !note.isArchived && !note.isPinned)
        );
        setPinnedNotes(notesData.filter((note) => note.isPinned));
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error); // Use console.error for errors
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const response = await DeleteNote({ id });
      if (response.success) {
        notify({
          message: "Note deleted successfully",
          flag: true,
        });
        // Optimistic update: filter out the note immediately
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
        setPinnedNotes((prevPinned) =>
          prevPinned.filter((note) => note._id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      notify({
        message: "Failed to delete note",
        flag: false,
      });
    }
  };

  const copyNote = async (note: INote) => {
    try {
      const textToCopy = `${note.title ? note.title + "\n\n" : ""}${note.note}`;
      await navigator.clipboard.writeText(textToCopy);
      notify({
        message: "Note copied to clipboard",
        flag: true,
      });
    } catch (error) {
      console.error("Error copying note:", error);
      notify({
        message: "Failed to copy note",
        flag: false,
      });
    }
  };

  const archiveNote = async (note: INote) => {
    try {
      const response = await ArchiveNote({
        noteId: note._id as string,
        userId: session?.data?.user.id as string,
      });
      if (response.success) {
        toast.success(response.message || "Note is archived");
        // Optimistic update: remove from current lists
        setNotes((prevNotes) =>
          prevNotes.filter((item) => item._id !== note._id)
        );
        setPinnedNotes((prevPinned) =>
          prevPinned.filter((item) => item._id !== note._id)
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const pinUnpinNote = async (note: INote, flag: boolean) => {
    try {
      const response = await PinnedNote({
        noteId: note._id as string,
        userId: session?.data?.user.id as string,
        flag,
      });
      if (response.success) {
        const noteObj = response.data as INote;
        toast.success(response.message);

        // Update state based on pin status
        if (noteObj.isPinned) {
          setPinnedNotes((prevNotes) => [noteObj, ...prevNotes]);
          setNotes((prevNotes) =>
            prevNotes.filter((item) => item._id !== noteObj._id)
          );
        } else {
          setNotes((prevNotes) => [noteObj, ...prevNotes]);
          setPinnedNotes((prevPinned) =>
            prevPinned.filter((item) => item._id !== noteObj._id)
          );
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleDropdownOpenChange = (
    noteId: string,
    isOpen: boolean
  ): Set<string> => {
    setOpenDropdowns((prevSet) => {
      const newSet = new Set(prevSet);
      if (isOpen) {
        newSet.add(noteId);
      } else {
        newSet.delete(noteId);
      }
      return newSet;
    });
    return openDropdowns;
  };

  const shouldShowHoverEffects = (noteId: string) => {
    return (
      (hoveredNoteId === noteId && openDropdowns.size === 0) ||
      openDropdowns.has(noteId)
    );
  };

  // This prevents flickering if the mouse briefly leaves a card while its dropdown is open.
  const handleNoteMouseEnter = (noteId: string) => {
    if (openDropdowns.size === 0) {
      setHoveredNoteId(noteId);
    }
  };

  const handleNoteMouseLeave = (noteId: string) => {
    // Or, more precisely, if the dropdown for THIS note is not open.
    if (!openDropdowns.has(noteId)) {
      setHoveredNoteId(null);
    }
  };

  useEffect(() => {
    if (session.data?.user.id) {
      fetchNotes(session.data.user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.data?.user.id]); // Dependency array to refetch when user ID changes

  useEffect(() => {
    if (data && data.note) {
      // Add newly created note to the appropriate list
      if (!data.isPinned) {
        setNotes((prevNotes) => [data, ...prevNotes]);
      } else {
        setPinnedNotes((prevPinned) => [data, ...prevPinned]);
      }
    }
  }, [data]); // Depend on 'data' to add new notes

  const menuitems = React.useCallback(
    (item: INote): MoreOperationsItem[] => [
      {
        title: "Make a Copy",
        icon: <Copy className="mr-2 h-4 w-4" />,
        isClickable: true,
        handleClick: () => copyNote(item),
      },
      {
        title: "Archive",
        icon: <Archive className="mr-2 h-4 w-4" />,
        isClickable: true,
        handleClick: () => archiveNote(item),
      },
      {
        title: "Delete Note",
        icon: <Trash2 className="mr-2 h-4 w-4" />,
        isClickable: true,
        handleClick: () => deleteNote(item._id as string),
      },
    ],
    [copyNote, archiveNote, deleteNote]
  ); // Dependencies for useCallback

  // on drag
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id || !over) {
      return;
    }

    setNotes((currentNotes) => {
      const oldIndex = currentNotes.findIndex((note) => note._id === active.id);
      const newIndex = currentNotes.findIndex((note) => note._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(currentNotes, oldIndex, newIndex);
      }
      return currentNotes;
    });
  };

  // Optimized Dnd-kit sensors
  const sensors = useSensors(
    // PointerSensor: ideal for mouse and touch, but for touch, we add activation constraints
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), // Drag starts after 8px movement
    // TouchSensor: specific for touch devices, with a delay to differentiate from scrolling/tapping
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 500 },
    }), // Hold for 250ms, allow some movement
    // KeyboardSensor: for accessibility with keyboard dragging
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="mx-auto p-5">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      >
        {/* Pinned Notes Section */}
        {pinnedNotes.length > 0 && (
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Pinned</h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {pinnedNotes.map((item) => (
            <div
              key={item._id as string}
              onMouseEnter={() => handleNoteMouseEnter(item._id as string)}
              onMouseLeave={() => handleNoteMouseLeave(item._id as string)}
              className="md:w-[18rem] mb-16 note min-h-34 h-fit p-5 border border-gray-300 hover:border-gray-500 rounded-sm transition-colors duration-200 relative"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 truncate pr-2">
                  {item.title || "Untitled Note"}
                </h3>
                {/* Pin icon (filled for pinned notes) with unpin functionality */}
                <TooltipButton
                  icon={
                    <PushpinFilled className="text-xl cursor-pointer text-gray-500 hover:text-gray-700" />
                  }
                  onClick={() => pinUnpinNote(item as INote, false)}
                  tooltipText="Unpin Note"
                />
              </div>

              {/* Select icon (visibility based on hover/selection) */}
              <div
                className={`absolute z-10
                  ${
                    shouldShowHoverEffects(item._id as string) ||
                    selectedIds.includes(item._id as string)
                      ? "opacity-100"
                      : "opacity-0"
                  }
                  left-[-1.2rem] top-[-0.8rem] transition-opacity duration-200 cursor-pointer
                `}
                onClick={() => {
                  setSelectedIds((prev: string[]) =>
                    prev.includes(item._id as string)
                      ? prev.filter((id: string) => id !== item._id)
                      : [...prev, item._id as string]
                  );
                }}
              >
                <TooltipButton
                  icon={<CheckCircleFilled className="text-xl" />}
                  tooltipText="Select note"
                />
              </div>

              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                {item.note.split("\n").map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>

              <NoteOptions
                setIsMoreClicked={setIsMoreClicked} // Consider if this is still needed
                isMoreClicked={isMoreClicked} // Consider if this is still needed
                moreOperationsItems={menuitems(item)}
                shouldShowHoverEffects={shouldShowHoverEffects(
                  item._id as string
                )}
                onDropdownOpenChange={(isOpen) =>
                  handleDropdownOpenChange(item._id as string, isOpen)
                }
              />
            </div>
          ))}
        </div>

        {/* Regular Notes Section */}
        {pinnedNotes.length > 0 && notes.length > 0 && (
          <h2 className="text-sm font-semibold text-gray-800 mt-8 mb-2">
            Others
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
          {loading ? (
            <div className="flex items-center justify-center col-span-full">
              {" "}
              {/* Use col-span-full for full width loading */}
              <LoadingOutlined className="text-3xl text-yellow-500" />
            </div>
          ) : notes.length > 0 ? (
            <SortableContext
              items={notes.map((note) => note._id as string)} // Pass only IDs to SortableContext
              strategy={rectSortingStrategy}
            >
              {notes.map((item) => (
                <SortableNoteCard
                  key={item._id as string}
                  id={item._id as string} // Pass _id as the dnd-kit id
                  item={item}
                  selectedIds={selectedIds}
                  shouldShowHoverEffects={shouldShowHoverEffects}
                  setSelectedIds={setSelectedIds}
                  setIsMoreClicked={setIsMoreClicked}
                  isMoreClicked={isMoreClicked}
                  pinUnpinNote={pinUnpinNote}
                  handleDropdownOpenChange={handleDropdownOpenChange}
                  menuitems={menuitems}
                  onMouseEnter={handleNoteMouseEnter}
                  onMouseLeave={handleNoteMouseLeave}
                />
              ))}
            </SortableContext>
          ) : (
            // Only show EmptyNotes if there are no notes AND no pinned notes
            notes.length === 0 && pinnedNotes.length === 0 && <EmptyNotes />
          )}
        </div>
      </DndContext>
    </div>
  );
};

export default NoteList;
