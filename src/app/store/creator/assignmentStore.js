import { create } from "zustand";

const useAssignmentStore = create((set) => ({
  course: "CSC 240",
  description: "",
  dateGiven: "",
  dueDate: "",
  files: [],

  setCourse: (course) => set({ course }),
  setDescription: (description) => set({ description }),
  setDateGiven: (dateGiven) => set({ dateGiven }),
  setDueDate: (dueDate) => set({ dueDate }),

  addFiles: (newFiles) =>
    set((state) => ({ files: [...state.files, ...newFiles] })),

  clearFiles: () => set({ files: [] }),
}));

export default useAssignmentStore;
