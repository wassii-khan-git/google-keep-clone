// // // NoteList.tsx - Updated with hover state management
// // "use client";

// // import React, { useEffect, useState } from "react";
// // import {
// //   CheckCircleFilled,
// //   LoadingOutlined,
// //   MoreOutlined,
// //   PushpinFilled,
// //   PushpinOutlined,
// // } from "@ant-design/icons";
// // import {
// //   ArchiveNote,
// //   DeleteNote,
// //   GetAllNotes,
// //   PinnedNote,
// // } from "@/lib/actions/notes.actions";
// // import { INote } from "@/models/tasks.model";
// // import { notify } from "@/lib/utils";
// // import { Button } from "@/components/ui/button";
// // import { Trash2, Copy, Archive } from "lucide-react";
// // import { useSession } from "next-auth/react";
// // import { toast } from "sonner";
// // import CustomDropdown, {
// //   MoreOperationsItem,
// // } from "@/components/ui/custom-dropdown";
// // import TooltipButton from "@/components/ui/custom-tooltip";
// // import NoteOptions from "@/app/dashboard/(components)/note-options";
// // import EmptyNotes from "@/app/dashboard/(components)/empty-note";

// // interface NoteProps {
// //   data: INote;
// // }

// // const NoteList = ({ data }: NoteProps) => {
// //   // state to hold notes
// //   const [notes, setNotes] = useState<INote[]>([]);
// //   // state for pinned notes
// //   const [pinnedNotes, setPinnedNotes] = useState<INote[]>([]);
// //   // loading
// //   const [loading, setLoading] = useState<boolean>(true);
// //   // get the logged in user id
// //   const session = useSession();
// //   // more options clicked
// //   const [isMoreClicked, setIsMoreClicked] = useState<boolean>(false);
// //   // selected id
// //   const [selectedIds, setSelectedIds] = useState<Array<string>>([]);
// //   // Add hover state for each note
// //   const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
// //   // Track dropdown open state for each note
// //   const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

// //   // fetch notes function
// //   const fetchNotes = async (id: string) => {
// //     try {
// //       setLoading(true);
// //       const response = await GetAllNotes({
// //         userId: id,
// //         archive: false,
// //       });
// //       console.log(response);
// //       if (response.success) {
// //         const notesData = response.data as INote[];
// //         // filter out the unarchived and my notes
// //         setNotes(notesData.filter((note) => !note.isArchived));
// //         // set the filtered notes to the notes
// //         setPinnedNotes(notesData.filter((note) => note.isPinned));
// //         setLoading(false);
// //       }
// //     } catch (error) {
// //       console.log(error);
// //       setLoading(false);
// //     }
// //   };

// //   // Delete Note function
// //   const deleteNote = async (id: string) => {
// //     console.log(`Delete note with id: ${id}`);
// //     try {
// //       const response = await DeleteNote({ id });
// //       if (response.success) {
// //         notify({
// //           message: "Note deleted successfully",
// //           flag: true,
// //         });
// //         setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
// //         setPinnedNotes((prevPinned) =>
// //           prevPinned.filter((note) => note._id !== id)
// //         );
// //       }
// //     } catch (error) {
// //       console.error("Error deleting note:", error);
// //       notify({
// //         message: "Failed to delete note",
// //         flag: false,
// //       });
// //     }
// //   };

// //   // Copy note function
// //   const copyNote = async (note: INote) => {
// //     try {
// //       const textToCopy = `${note.title ? note.title + "\n\n" : ""}${note.note}`;
// //       await navigator.clipboard.writeText(textToCopy);
// //       notify({
// //         message: "Note copied to clipboard",
// //         flag: true,
// //       });
// //     } catch (error) {
// //       console.error("Error copying note:", error);
// //       notify({
// //         message: "Failed to copy note",
// //         flag: false,
// //       });
// //     }
// //   };

// //   // Archive note function
// //   const archiveNote = async (note: INote) => {
// //     try {
// //       const response = await ArchiveNote({
// //         noteId: note._id as string,
// //         userId: session?.data?.user.id as string,
// //       });
// //       if (response.success) {
// //         toast.success(response.message || "Note is archived");
// //         const filterNote = notes.filter((item) => item._id !== note._id);
// //         setNotes(filterNote);
// //       } else {
// //         toast.error(response.message);
// //       }
// //     } catch (error) {
// //       if (error instanceof Error) {
// //         toast.error(error.message);
// //       }
// //     }
// //   };

// //   // Pin/Unpin note function
// //   const pinUnpinNote = async (note: INote, flag: boolean) => {
// //     try {
// //       const response = await PinnedNote({
// //         noteId: note._id as string,
// //         userId: session?.data?.user.id as string,
// //         flag,
// //       });
// //       if (response.success) {
// //         const noteObj = response.data as INote;
// //         if (noteObj.isPinned) {
// //           toast.success(response.message);
// //           setPinnedNotes((prevNotes) => [noteObj, ...prevNotes]);
// //           setNotes((prevNotes) =>
// //             prevNotes.filter((item) => item._id !== noteObj._id)
// //           );
// //         } else if (!noteObj.isPinned) {
// //           toast.success(response.message);
// //           setPinnedNotes((prevNotes) =>
// //             prevNotes.filter((item) => item._id !== noteObj._id)
// //           );
// //           setNotes((prevNotes) => [noteObj, ...prevNotes]);
// //         }
// //       } else {
// //         toast.error(response.message);
// //       }
// //     } catch (error) {
// //       if (error instanceof Error) {
// //         toast.error(error.message);
// //       }
// //     }
// //   };

// //   // Handle dropdown open/close
// //   const handleDropdownOpenChange = (noteId: string, isOpen: boolean) => {
// //     setOpenDropdowns((prev) => {
// //       const newSet = new Set(prev);
// //       if (isOpen) {
// //         newSet.add(noteId);
// //       } else {
// //         newSet.delete(noteId);
// //       }
// //       return newSet;
// //     });
// //   };

// //   // Check if note should show hover effects
// //   const shouldShowHoverEffects = (noteId: string) => {
// //     return hoveredNoteId === noteId || openDropdowns.has(noteId);
// //   };

// //   // Fetch notes on component mount
// //   useEffect(() => {
// //     if (session.data?.user.id) {
// //       fetchNotes(session.data.user.id);
// //     }
// //   }, [session]);

// //   // If data is provided, add it to the notes
// //   useEffect(() => {
// //     if (data && data.note) {
// //       setNotes((prevNotes) => [data, ...prevNotes]);
// //     }
// //   }, [data]);

// //   // Menu items for each note - Fixed return type
// //   const menuitems = (item: INote): MoreOperationsItem[] => [
// //     {
// //       title: "Make a Copy",
// //       icon: <Copy className="mr-2 h-4 w-4" />,
// //       isClickable: true,
// //       handleClick: () => copyNote(item),
// //     },
// //     {
// //       title: "Archive",
// //       icon: <Archive className="mr-2 h-4 w-4" />,
// //       isClickable: true,
// //       handleClick: () => archiveNote(item),
// //     },
// //     {
// //       title: "Delete Note",
// //       icon: <Trash2 className="mr-2 h-4 w-4" />,
// //       isClickable: true,
// //       handleClick: () => deleteNote(item._id as string),
// //     },
// //   ];

// //   return (
// //     <div className="mx-auto p-5">
// //       {/* pinned note item */}
// //       {pinnedNotes.length > 0 && (
// //         <h2 className="text-sm font-semibold text-gray-800 mb-2">Pinned</h2>
// //       )}
// //       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
// //         {pinnedNotes.map((item, index) => (
// //           <div
// //             key={index}
// //             className="md:w-[18rem] mb-16 note min-h-34 h-fit p-5 border border-gray-300 hover:border-gray-500 rounded-sm transition-colors duration-200"
// //           >
// //             <div className="flex justify-between items-center">
// //               <h3 className="font-semibold text-gray-800 truncate pr-2">
// //                 {item.title || "Untitled Note"}
// //               </h3>
// //               <TooltipButton
// //                 icon={
// //                   <PushpinFilled className="text-xl cursor-pointer text-gray-500 hover:text-gray-700" />
// //                 }
// //                 onClick={() => pinUnpinNote(item as INote, false)}
// //                 tooltipText="Unpin Note"
// //               />
// //             </div>

// //             <p className="text-gray-600 mt-3 text-sm leading-relaxed">
// //               {item.note.split("\n").map((line, idx) => (
// //                 <span key={idx}>
// //                   {line}
// //                   <br />
// //                 </span>
// //               ))}
// //             </p>

// //             <div className="flex items-center justify-end mt-3">
// //               <CustomDropdown menuitems={menuitems(item)} direction="start">
// //                 <Button
// //                   variant="outline"
// //                   size="sm"
// //                   className="h-8 w-8 p-0 rounded-full"
// //                 >
// //                   <MoreOutlined className="text-gray-500" />
// //                   <span className="sr-only">Open menu</span>
// //                 </Button>
// //               </CustomDropdown>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Note list */}
// //       {pinnedNotes.length > 0 && notes.length > 0 && (
// //         <h2 className="text-sm font-semibold text-gray-800 mb-2">Others</h2>
// //       )}
// //       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
// //         {loading ? (
// //           <div className="flex items-center justify-center col-span-4">
// //             <LoadingOutlined className="text-3xl text-yellow-500" />
// //           </div>
// //         ) : notes.length > 0 ? (
// //           notes.map((item, index) => (
// //             <div
// //               key={index}
// //               className="relative group"
// //               onMouseEnter={() => setHoveredNoteId(item._id as string)}
// //               onMouseLeave={() => setHoveredNoteId(null)}
// //             >
// //               {/* Note item */}
// //               {!item.isPinned && (
// //                 <div
// //                   className={`min-h-34 h-fit p-5 ${
// //                     selectedIds.includes(item._id as string)
// //                       ? "border border-black rounded-sm"
// //                       : "border-gray-300"
// //                   } border  hover:shadow-md rounded-sm transition-colors transition-border duration-300`}
// //                 >
// //                   <div className="flex justify-between items-center">
// //                     <h3 className="font-semibold text-gray-800 truncate pr-2">
// //                       {item.title || "Untitled Note"}
// //                     </h3>
// //                     <div
// //                       className={`${
// //                         shouldShowHoverEffects(item._id as string)
// //                           ? "opacity-100"
// //                           : "opacity-0"
// //                       } transition-opacity`}
// //                     >
// //                       <TooltipButton
// //                         icon={
// //                           <PushpinOutlined className="cursor-pointer text-gray-500 hover:text-gray-700" />
// //                         }
// //                         onClick={() => pinUnpinNote(item as INote, true)}
// //                         tooltipText="Pin Note"
// //                       />
// //                     </div>
// //                   </div>

// //                   {/* Select icon  */}
// //                   <div
// //                     className={`absolute ${
// //                       !selectedIds.includes(item._id as string) &&
// //                       !shouldShowHoverEffects(item._id as string) &&
// //                       "opacity-0"
// //                     } ${
// //                       shouldShowHoverEffects(item._id as string)
// //                         ? "opacity-100"
// //                         : ""
// //                     } left-[-1.2rem] top-[-0.8rem] transition-opacity`}
// //                     onClick={() => {
// //                       setSelectedIds((prev) =>
// //                         prev.includes(item._id as string)
// //                           ? prev.filter((id) => id !== (item._id as string))
// //                           : [...prev, item._id as string]
// //                       );
// //                     }}
// //                   >
// //                     <TooltipButton
// //                       idx={1}
// //                       icon={<CheckCircleFilled className="text-xl" />}
// //                       tooltipText="Select note"
// //                     />
// //                   </div>

// //                   <p className="text-gray-600 mt-3 text-sm leading-relaxed">
// //                     {item.note.split("\n").map((line, idx) => (
// //                       <span key={idx}>
// //                         {line}
// //                         <br />
// //                       </span>
// //                     ))}
// //                   </p>

// //                   {/* Bottom icons */}
// //                   <NoteOptions
// //                     setIsMoreClicked={setIsMoreClicked}
// //                     isMoreClicked={isMoreClicked}
// //                     moreOperationsItems={menuitems(item as INote)}
// //                     shouldShowHoverEffects={shouldShowHoverEffects(
// //                       item._id as string
// //                     )}
// //                     onDropdownOpenChange={(isOpen) =>
// //                       handleDropdownOpenChange(item._id as string, isOpen)
// //                     }
// //                   />
// //                 </div>
// //               )}
// //             </div>
// //           ))
// //         ) : (
// //           notes.length === 0 && pinnedNotes.length === 0 && <EmptyNotes />
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default NoteList;

// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   CheckCircleFilled,
//   LoadingOutlined,
//   PushpinFilled,
// } from "@ant-design/icons";
// import {
//   ArchiveNote,
//   DeleteNote,
//   GetAllNotes,
//   PinnedNote,
// } from "@/lib/actions/notes.actions";
// import { INote } from "@/models/tasks.model";
// import { notify } from "@/lib/utils";
// import { Trash2, Copy, Archive } from "lucide-react";
// import EmptyNotes from "./empty-note";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// import { MoreOperationsItem } from "@/components/ui/custom-dropdown";
// import TooltipButton from "@/components/ui/custom-tooltip";
// import NoteOptions from "./note-options";
// import {
//   closestCenter,
//   DndContext,
//   DragEndEvent,
//   KeyboardSensor,
//   PointerSensor,
//   TouchSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   rectSortingStrategy,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
// } from "@dnd-kit/sortable";
// import NoteCard from "./card"; // Corrected path to your NoteCard component
// import { Transition } from "@dnd-kit/utilities";
// interface NoteProps {
//   data: INote;
// }

// interface SortableNoteCardProps {
//   id: string; // The dnd-kit id (should be note._id)
//   item: INote; // The actual note object
//   selectedIds: string[];
//   shouldShowHoverEffects: (noteId: string) => boolean;
//   setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
//   setIsMoreClicked: React.Dispatch<React.SetStateAction<boolean>>;
//   isMoreClicked: boolean;
//   menuitems: (item: INote) => MoreOperationsItem[];
//   handleDropdownOpenChange: (id: string, isOpen: boolean) => Set<string>;
//   pinUnpinNote: (note: INote, isPinned: boolean) => void;
//   onMouseEnter: (noteId: string) => void;
//   onMouseLeave: (noteId: string) => void;
// }

// function SortableNoteCard({
//   id,
//   item,
//   ...rest // Spread all other props
// }: SortableNoteCardProps) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: id }); // Use the unique ID for sortable item

//   return (
//     // Apply touch-action-none to prevent default browser touch behaviors like scrolling
//     // on the draggable element, which is crucial for smooth mobile dragging.
//     <div className="touch-action-none">
//       <NoteCard
//         ref={setNodeRef} // Attach the ref for dnd-kit
//         transform={transform} // Pass dnd-kit's transform
//         transition={transition as unknown as Transition} // Pass dnd-kit's transition cast to Transition type
//         attributes={attributes} // Pass dnd-kit attributes
//         listeners={listeners} // Pass dnd-kit listeners
//         isDragging={isDragging} // Pass dnd-kit isDragging state
//         item={item}
//         {...rest} // Pass all other props
//       />
//     </div>
//   );
// }

// const NoteList = ({ data }: NoteProps) => {
//   const [notes, setNotes] = useState<INote[]>([]);
//   const [pinnedNotes, setPinnedNotes] = useState<INote[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const session = useSession();
//   const [isMoreClicked, setIsMoreClicked] = useState<boolean>(false); // Consider if this is truly needed at global level or can be local to NoteCard
//   const [selectedIds, setSelectedIds] = useState<Array<string>>([]);
//   const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
//   const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

//   const fetchNotes = async (id: string) => {
//     setLoading(true);
//     try {
//       const response = await GetAllNotes({
//         userId: id,
//         archive: false,
//       });
//       if (response.success) {
//         const notesData = response.data as INote[];
//         setNotes(
//           notesData.filter((note) => !note.isArchived && !note.isPinned)
//         );
//         setPinnedNotes(notesData.filter((note) => note.isPinned));
//       }
//     } catch (error) {
//       console.error("Failed to fetch notes:", error); // Use console.error for errors
//     } finally {
//       setLoading(false); // Ensure loading state is reset
//     }
//   };

//   const deleteNote = async (id: string) => {
//     try {
//       const response = await DeleteNote({ id });
//       if (response.success) {
//         notify({
//           message: "Note deleted successfully",
//           flag: true,
//         });
//         // Optimistic update: filter out the note immediately
//         setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
//         setPinnedNotes((prevPinned) =>
//           prevPinned.filter((note) => note._id !== id)
//         );
//       }
//     } catch (error) {
//       console.error("Error deleting note:", error);
//       notify({
//         message: "Failed to delete note",
//         flag: false,
//       });
//     }
//   };

//   const copyNote = async (note: INote) => {
//     try {
//       const textToCopy = `${note.title ? note.title + "\n\n" : ""}${note.note}`;
//       await navigator.clipboard.writeText(textToCopy);
//       notify({
//         message: "Note copied to clipboard",
//         flag: true,
//       });
//     } catch (error) {
//       console.error("Error copying note:", error);
//       notify({
//         message: "Failed to copy note",
//         flag: false,
//       });
//     }
//   };

//   const archiveNote = async (note: INote) => {
//     try {
//       const response = await ArchiveNote({
//         noteId: note._id as string,
//         userId: session?.data?.user.id as string,
//       });
//       if (response.success) {
//         toast.success(response.message || "Note is archived");
//         // Optimistic update: remove from current lists
//         setNotes((prevNotes) =>
//           prevNotes.filter((item) => item._id !== note._id)
//         );
//         setPinnedNotes((prevPinned) =>
//           prevPinned.filter((item) => item._id !== note._id)
//         );
//       } else {
//         toast.error(response.message);
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         toast.error(error.message);
//       }
//     }
//   };

//   const pinUnpinNote = async (note: INote, flag: boolean) => {
//     try {
//       const response = await PinnedNote({
//         noteId: note._id as string,
//         userId: session?.data?.user.id as string,
//         flag,
//       });
//       if (response.success) {
//         const noteObj = response.data as INote;
//         toast.success(response.message);

//         // Update state based on pin status
//         if (noteObj.isPinned) {
//           setPinnedNotes((prevNotes) => [noteObj, ...prevNotes]);
//           setNotes((prevNotes) =>
//             prevNotes.filter((item) => item._id !== noteObj._id)
//           );
//         } else {
//           setNotes((prevNotes) => [noteObj, ...prevNotes]);
//           setPinnedNotes((prevPinned) =>
//             prevPinned.filter((item) => item._id !== noteObj._id)
//           );
//         }
//       } else {
//         toast.error(response.message);
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         toast.error(error.message);
//       }
//     }
//   };

//   const handleDropdownOpenChange = (
//     noteId: string,
//     isOpen: boolean
//   ): Set<string> => {
//     setOpenDropdowns((prevSet) => {
//       const newSet = new Set(prevSet);
//       if (isOpen) {
//         newSet.add(noteId);
//       } else {
//         newSet.delete(noteId);
//       }
//       return newSet;
//     });
//     return openDropdowns; // Note: This return might not reflect the immediate state change due to useState's async nature. If you need the updated set immediately elsewhere, pass it as a callback or use an effect.
//   };

//   const shouldShowHoverEffects = (noteId: string) => {
//     // Only show hover effects if it's the currently hovered note AND no dropdowns are open
//     // OR if the dropdown for this specific note is open.
//     // This prevents hover effects from interfering with an open dropdown on a different note.
//     return (
//       (hoveredNoteId === noteId && openDropdowns.size === 0) ||
//       openDropdowns.has(noteId)
//     );
//   };

//   // Only update hoveredNoteId if no dropdown is currently open.
//   // This prevents flickering if the mouse briefly leaves a card while its dropdown is open.
//   const handleNoteMouseEnter = (noteId: string) => {
//     if (openDropdowns.size === 0) {
//       setHoveredNoteId(noteId);
//     }
//   };

//   const handleNoteMouseLeave = (noteId: string) => {
//     // Only clear hoveredNoteId if no dropdown is open for ANY note.
//     // Or, more precisely, if the dropdown for THIS note is not open.
//     if (!openDropdowns.has(noteId)) {
//       setHoveredNoteId(null);
//     }
//   };

//   useEffect(() => {
//     if (session.data?.user.id) {
//       fetchNotes(session.data.user.id);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [session.data?.user.id]); // Dependency array to refetch when user ID changes

//   useEffect(() => {
//     if (data && data.note) {
//       // Add newly created note to the appropriate list
//       if (!data.isPinned) {
//         setNotes((prevNotes) => [data, ...prevNotes]);
//       } else {
//         setPinnedNotes((prevPinned) => [data, ...prevPinned]);
//       }
//     }
//   }, [data]); // Depend on 'data' to add new notes

//   const menuitems = React.useCallback(
//     (item: INote): MoreOperationsItem[] => [
//       {
//         title: "Make a Copy",
//         icon: <Copy className="mr-2 h-4 w-4" />,
//         isClickable: true,
//         handleClick: () => copyNote(item),
//       },
//       {
//         title: "Archive",
//         icon: <Archive className="mr-2 h-4 w-4" />,
//         isClickable: true,
//         handleClick: () => archiveNote(item),
//       },
//       {
//         title: "Delete Note",
//         icon: <Trash2 className="mr-2 h-4 w-4" />,
//         isClickable: true,
//         handleClick: () => deleteNote(item._id as string),
//       },
//     ],
//     [copyNote, archiveNote, deleteNote]
//   ); // Dependencies for useCallback

//   const onDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (active.id === over?.id || !over) {
//       return;
//     }

//     setNotes((currentNotes) => {
//       const oldIndex = currentNotes.findIndex((note) => note._id === active.id);
//       const newIndex = currentNotes.findIndex((note) => note._id === over.id);

//       if (oldIndex !== -1 && newIndex !== -1) {
//         return arrayMove(currentNotes, oldIndex, newIndex);
//       }
//       return currentNotes;
//     });
//   };

//   // Optimized Dnd-kit sensors
//   const sensors = useSensors(
//     // PointerSensor: ideal for mouse and touch, but for touch, we add activation constraints
//     useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), // Drag starts after 8px movement
//     // TouchSensor: specific for touch devices, with a delay to differentiate from scrolling/tapping
//     useSensor(TouchSensor, {
//       activationConstraint: { delay: 250, tolerance: 500 },
//     }), // Hold for 250ms, allow some movement
//     // KeyboardSensor: for accessibility with keyboard dragging
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   return (
//     <div className="mx-auto p-5">
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragEnd={onDragEnd}
//         // Consider adding `measuring` strategy if note sizes are highly dynamic
//         // measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
//       >
//         {/* Pinned Notes Section */}
//         {pinnedNotes.length > 0 && (
//           <h2 className="text-sm font-semibold text-gray-800 mb-2">Pinned</h2>
//         )}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
//           {pinnedNotes.map((item) => (
//             <div
//               key={item._id as string}
//               onMouseEnter={() => handleNoteMouseEnter(item._id as string)}
//               onMouseLeave={() => handleNoteMouseLeave(item._id as string)}
//               className="md:w-[18rem] mb-16 note min-h-34 h-fit p-5 border border-gray-300 hover:border-gray-500 rounded-sm transition-colors duration-200 relative"
//             >
//               <div className="flex justify-between items-center">
//                 <h3 className="font-semibold text-gray-800 truncate pr-2">
//                   {item.title || "Untitled Note"}
//                 </h3>
//                 {/* Pin icon (filled for pinned notes) with unpin functionality */}
//                 <TooltipButton
//                   icon={
//                     <PushpinFilled className="text-xl cursor-pointer text-gray-500 hover:text-gray-700" />
//                   }
//                   onClick={() => pinUnpinNote(item as INote, false)}
//                   tooltipText="Unpin Note"
//                 />
//               </div>

//               {/* Select icon (visibility based on hover/selection) */}
//               <div
//                 className={`absolute z-10
//                   ${
//                     shouldShowHoverEffects(item._id as string) ||
//                     selectedIds.includes(item._id as string)
//                       ? "opacity-100"
//                       : "opacity-0"
//                   }
//                   left-[-1.2rem] top-[-0.8rem] transition-opacity duration-200 cursor-pointer
//                 `}
//                 onClick={() => {
//                   setSelectedIds((prev: string[]) =>
//                     prev.includes(item._id as string)
//                       ? prev.filter((id: string) => id !== item._id)
//                       : [...prev, item._id as string]
//                   );
//                 }}
//               >
//                 <TooltipButton
//                   icon={<CheckCircleFilled className="text-xl" />}
//                   tooltipText="Select note"
//                 />
//               </div>

//               <p className="text-gray-600 mt-3 text-sm leading-relaxed">
//                 {item.note.split("\n").map((line, idx) => (
//                   <span key={idx}>
//                     {line}
//                     <br />
//                   </span>
//                 ))}
//               </p>

//               <NoteOptions
//                 setIsMoreClicked={setIsMoreClicked} // Consider if this is still needed
//                 isMoreClicked={isMoreClicked} // Consider if this is still needed
//                 moreOperationsItems={menuitems(item)}
//                 shouldShowHoverEffects={shouldShowHoverEffects(
//                   item._id as string
//                 )}
//                 onDropdownOpenChange={(isOpen) =>
//                   handleDropdownOpenChange(item._id as string, isOpen)
//                 }
//               />
//             </div>
//           ))}
//         </div>

//         {/* Regular Notes Section */}
//         {pinnedNotes.length > 0 && notes.length > 0 && (
//           <h2 className="text-sm font-semibold text-gray-800 mt-8 mb-2">
//             Others
//           </h2>
//         )}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
//           {loading ? (
//             <div className="flex items-center justify-center col-span-full">
//               {" "}
//               {/* Use col-span-full for full width loading */}
//               <LoadingOutlined className="text-3xl text-yellow-500" />
//             </div>
//           ) : notes.length > 0 ? (
//             <SortableContext
//               items={notes.map((note) => note._id as string)} // Pass only IDs to SortableContext
//               strategy={rectSortingStrategy}
//             >
//               {notes.map((item) => (
//                 <SortableNoteCard
//                   key={item._id as string}
//                   id={item._id as string} // Pass _id as the dnd-kit id
//                   item={item}
//                   selectedIds={selectedIds}
//                   shouldShowHoverEffects={shouldShowHoverEffects}
//                   setSelectedIds={setSelectedIds}
//                   setIsMoreClicked={setIsMoreClicked}
//                   isMoreClicked={isMoreClicked}
//                   pinUnpinNote={pinUnpinNote}
//                   handleDropdownOpenChange={handleDropdownOpenChange}
//                   menuitems={menuitems}
//                   onMouseEnter={handleNoteMouseEnter}
//                   onMouseLeave={handleNoteMouseLeave}
//                 />
//               ))}
//             </SortableContext>
//           ) : (
//             // Only show EmptyNotes if there are no notes AND no pinned notes
//             notes.length === 0 && pinnedNotes.length === 0 && <EmptyNotes />
//           )}
//         </div>
//       </DndContext>
//     </div>
//   );
// };

// export default NoteList;
