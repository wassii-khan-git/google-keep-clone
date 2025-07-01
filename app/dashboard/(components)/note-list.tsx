"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ArchiveNote,
  DeleteNote,
  GetAllNotes,
  PinnedNote,
  UploadFile,
} from "@/lib/actions/notes.actions";
import { INote } from "@/models/tasks.model";
import { notify } from "@/lib/utils";
import EmptyNotes from "./empty-note";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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
import { LoadingOutlined } from "@ant-design/icons";
import {
  BellPlus,
  EllipsisVertical,
  FolderDown,
  ImageIcon,
  Palette,
  UserPlus,
} from "lucide-react";
import { MenuItemsProps } from "@/components/ui/custom-dropdown";
import NoteDetailsDialog from "./note-dialog";
import useNoteStore from "@/store/note-store";

const NoteList = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [pinnedNotes, setPinnedNotes] = useState<INote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMoreClicked, setIsMoreClicked] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Array<string>>([]);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const session = useSession();
  const { notes: noteItems, isUpdate, emptyNotes } = useNoteStore();

  // fetch notes
  const fetchNotes = useCallback(async (id: string) => {
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
        setPinnedNotes(
          notesData.filter((note) => note.isPinned && !note.isArchived)
        );
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error); // Use console.error for errors
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  }, []);

  // delete note
  const deleteNote = useCallback(async (id: string) => {
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
  }, []);

  // copy note
  const copyNote = useCallback(async (note: INote) => {
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
  }, []);

  // archive note
  const archiveNote = useCallback(
    async (note: INote) => {
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
    },
    [session?.data?.user.id, setNotes, setPinnedNotes]
  );

  // pinunpin note
  const pinUnpinNote = useCallback(
    async (note: INote, flag: boolean) => {
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
    },
    [session?.data?.user.id]
  );

  // handle image upload
  const handleImageUpload = useCallback(async (noteId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    const formData = new FormData();

    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      // if it contains any data
      if (target && target.files?.[0]) {
        // set the attributes
        formData.set("image", target.files?.[0]);
        formData.set("noteId", noteId);
        try {
          const result = await UploadFile(formData);
          if (result.success) {
            toast.success("image uploaded successfully", {
              description: result?.data?.note,
            });
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "failed to upload"
          );
        }
      }
    };
    // add the click event
    input.click();
  }, []);

  // handle dropdown change
  const handleDropdownOpenChange = useCallback(
    (noteId: string, isOpen: boolean): Set<string> => {
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
    },
    [openDropdowns]
  );

  // should hover effects
  const shouldShowHoverEffects = useCallback(
    (noteId: string) => {
      return (
        (hoveredNoteId === noteId && openDropdowns.size === 0) ||
        openDropdowns.has(noteId)
      );
    },
    [hoveredNoteId, openDropdowns]
  );

  // This prevents flickering if the mouse briefly leaves a card while its dropdown is open.
  const handleNoteMouseEnter = useCallback(
    (noteId: string) => {
      if (openDropdowns.size === 0) {
        setHoveredNoteId(noteId);
      }
    },
    [openDropdowns]
  );

  // handle note mouse leave
  const handleNoteMouseLeave = useCallback(
    (noteId: string) => {
      // Or, more precisely, if the dropdown for THIS note is not open.
      if (!openDropdowns.has(noteId)) {
        setHoveredNoteId(null);
      }
    },
    [openDropdowns]
  );

  useEffect(() => {
    if (session.data?.user.id) {
      fetchNotes(session.data.user.id);
    }
  }, [session.data?.user.id, fetchNotes]); // Dependency array to refetch when user ID changes

  useEffect(() => {
    if (noteItems && noteItems?.[0]?.note) {
      if (!noteItems?.[0]?.isPinned) {
        const filterNotes = isUpdate
          ? (prevNotes: INote[]) => [
              ...prevNotes.map((i) =>
                i._id === noteItems?.[0]._id ? noteItems?.[0] : i
              ),
            ]
          : (prevNotes: INote[]) => [noteItems?.[0], ...prevNotes];
        setNotes(filterNotes);
        emptyNotes();
      } else {
        setPinnedNotes((prevPinned) => [noteItems?.[0], ...prevPinned]);
        emptyNotes();
      }
    }
  }, [noteItems, isUpdate, emptyNotes]); // Depend on 'noteItems' to add new notes

  // menuItems
  const menuitems = useCallback(
    (item: INote): MenuItemsProps[] => [
      {
        title: "More Options",
        icon: <EllipsisVertical size={18} />,
        isClickable: true,
        handleClick: () => console.log("more options"),
        childs: [
          {
            title: "Make a Copy",
            // icon: <Copy className="mr-2 h-4 w-4" />,
            isClickable: true,
            handleClick: () => copyNote(item),
          },
          {
            title: "Delete Note",
            // icon: <Trash2 className="mr-2 h-4 w-4" />,
            isClickable: true,
            handleClick: () => deleteNote(item._id as string),
          },
        ],
      },
      {
        title: "Add archive",
        icon: <FolderDown size={18} />,
        isClickable: true,
        handleClick: () => archiveNote(item as INote),
        childs: [],
      },
      {
        title: "Add Image",
        icon: <ImageIcon size={18} />,
        isClickable: true,
        handleClick: () => handleImageUpload(item._id as string),
        childs: [],
      },
      {
        title: "Add Collaborator",
        icon: <UserPlus size={18} />,
        isClickable: true,
        handleClick: () => console.log("add image"),
        childs: [],
      },
      {
        title: "Add Reminder",
        icon: <BellPlus size={18} />,
        isClickable: true,
        handleClick: () => console.log("add image"),
        childs: [],
      },
      {
        title: "Add Background",
        icon: <Palette size={18} />,
        isClickable: true,
        handleClick: () => console.log("add image"),
        childs: [],
      },
    ],
    [copyNote, deleteNote, handleImageUpload, archiveNote]
  ); // Dependencies for useCallback

  // on drag end - memoized
  const onDragEnd = useCallback((event: DragEndEvent) => {
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
  }, []);

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
      {/* Add Note */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      >
        {/* Pinned Notes Section */}
        {pinnedNotes.length > 0 && (
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Pinned</h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
          <SortableContext
            items={pinnedNotes.map((note) => note._id as string)} // Pass only IDs to SortableContext
            strategy={rectSortingStrategy}
          >
            {pinnedNotes.map((item) => (
              <SortableNoteCard
                content="pinned"
                key={item._id as string} // Use _id for key
                id={item._id as string} // Use _id as the dnd-kit id for stability
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
        </div>
        {/* Regular Notes Section */}
        {pinnedNotes.length > 0 && notes.length > 0 && (
          <h2 className="text-sm font-semibold text-gray-800 mt-8 mb-2">
            Others
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
          {loading ? (
            <div className="flex items-center justify-start md:justify-center col-span-full">
              {/* Use col-span-full for full width loading */}
              <LoadingOutlined />
            </div>
          ) : notes.length > 0 ? (
            <SortableContext
              items={notes.map((note) => note._id as string)} // Pass only IDs to SortableContext
              strategy={rectSortingStrategy}
            >
              {notes.map((item) => (
                <NoteDetailsDialog
                  key={item._id as string}
                  note={item as INote}
                  trigger={
                    <div>
                      <SortableNoteCard
                        content="notes"
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
                    </div>
                  }
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
