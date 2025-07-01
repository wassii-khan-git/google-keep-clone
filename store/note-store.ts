import { INote } from "@/models/tasks.model";
import { create } from "zustand";

interface NoteStore {
  notes: INote[];
  mutateNotes: (item: INote, isUpdate: boolean) => void;
  emptyNotes: () => void;
  isUpdate: boolean;
}

const useNoteStore = create<NoteStore>()((set) => ({
  notes: [],
  isUpdate: false,
  mutateNotes: (item: INote, isUpdate) =>
    set(() => ({ notes: [item], isUpdate })),
  emptyNotes: () => set(() => ({ notes: [], isUpdate: false })),
}));

export default useNoteStore;
