import { create } from "zustand";
import axios from "axios";

const useResourceStore = create((set, get) => ({
  title: "",
  description: "",
  course: "",
  type: "",
  files: [],
  isLoading: false,

  setField: (field, value) => set({ [field]: value }),

  addFiles: (newFiles) => {
    const filesWithPreview = Array.from(newFiles).map((file) => ({
      id: crypto.randomUUID(),
      file,
      src: URL.createObjectURL(file),
    }));
    set((state) => ({ files: [...state.files, ...filesWithPreview] }));
  },

  removeFile: (id) => {
    set((state) => {
      const updatedFiles = state.files.filter((file) => file.id !== id);
      return { files: updatedFiles };
    });
  },

  reset: () =>
    set({ title: "", description: "", course: "", type: "", files: [] }),

  uploadResources: async () => {
    set({ isLoading: true });
    const { title, description, course, type, files } = get();

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
    files.forEach(({ file }) => formData.append("files", file));

    try {
      await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Resources uploaded successfully!");
      get().reset();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Try again.");
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useResourceStore;
