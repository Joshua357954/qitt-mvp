import { create } from "zustand";
import axios from "axios";

const useNoteStore = create((set) => ({
  course: "",
  description: "",
  files: [],
  loading: false,

  setCourse: (course) => set({ course }),
  setDescription: (description) => set({ description }),
  addFiles: (newFiles) =>
    set((state) => ({ files: [...state.files, ...newFiles] })),

  uploadNote: async () => {
    set({ loading: true });

    const { course, description, files } = useNoteStore.getState();

    if (!course || !description || files.length === 0) {
      alert("Please fill in all fields and upload at least one file.");
      set({ loading: false });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("course", course);
      formData.append("description", description);
      files.forEach((file) => formData.append("files", file));

      const response = await axios.post("/api/upload-note", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload successful:", response.data);
      alert("Note uploaded successfully!");

      set({ course: "", description: "", files: [] });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload note.");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useNoteStore;
