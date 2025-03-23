import { create } from "zustand";
import axios from "axios";

const useResourceStore = create((set) => ({
  title: "",
  description: "",
  course: "",
  type: "",
  files: [],
  isLoading: false,

  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  addFiles: (newFiles) => set((state) => ({ files: [...state.files, ...newFiles] })),
  reset: () => set({ title: "", description: "", course: "", type: "", files: [] }),

  uploadResources: async () => {
    set({ isLoading: true });
    const { title, description, course, type, files } = useResourceStore.getState();

    if (!title || !description || !course || !type || files.length === 0) {
      alert("Please fill all fields and upload at least one file.");
      set({ isLoading: false });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("course", course);
    formData.append("type", type);
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Resources uploaded successfully!");
      set({ isLoading: false });
      useResourceStore.getState().reset();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Try again.");
      set({ isLoading: false });
    }
  },
}));

export default useResourceStore;
