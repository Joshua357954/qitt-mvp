import { create } from "zustand";

const useAssignmentStore = create((set) => ({
  course: "",
  description: "",
  dateGiven: "",
  dueDate: "",
  files: [],
  isLoading: false,

  setCourse: (course) => set({ course }),
  setDescription: (description) => set({ description }),
  setDateGiven: (dateGiven) => set({ dateGiven }),
  setDueDate: (dueDate) => set({ dueDate }),

  addFiles: (newFiles) =>
    set((state) => ({ files: [...state.files, ...newFiles] })),

  removeFile: (id) =>
    set((state) => ({ files: state.files.filter((file) => file.id !== id) })),

  uploadAssignment: async () => {
    set({ isLoading: true });

    try {
      const { course, description, dateGiven, dueDate, files } =
        useAssignmentStore.getState();

      if (!course || !description || !dueDate || files.length === 0) {
        alert("Please fill all fields and upload at least one file.");
        set({ isLoading: false });
        return;
      }

      const formData = new FormData();
      formData.append("course", course);
      formData.append("description", description);
      formData.append("dateGiven", dateGiven);
      formData.append("dueDate", dueDate);

      files.forEach(({ file }) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload-assignment", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload");

      alert("Assignment uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading assignment.");
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAssignmentStore;
