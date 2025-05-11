import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../authStore";

const useResourceStore = create((set, get) => ({
  title: "",
  description: "",
  course: "",
  type: "",
  files: [],
  existingFiles: [],
  isLoading: false,
  success: false,
  error: null,

  // State Setters
  setField: (field, value) =>
    set((state) => ({ [field]: value })),

  setExistingFiles: (existingFiles) => set({ existingFiles }),

  // File Handlers
  addFiles: (newFiles) => {
    const uploadedFiles = Array.from(newFiles).map((file, index) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB 
          `);
        return null;
      }
      const objectUrl = URL.createObjectURL(file);
      return {
        id: `${file.name}-${Date.now()}-${index}`,
        src: objectUrl,
        url: objectUrl,
        file,
      };
    }).filter((file) => file !== null);
  
    set((state) => ({
      files: [...state.files, ...uploadedFiles],
    }));
  }, 

  // Remove a file from the list (supports both existing and new files)
  removeFile: (fileToRemove) => {
    set((state) => {
      const listType = state.existingFiles.some(
        (file) => file.url === fileToRemove.url
      )
        ? "existingFiles"
        : "files";
      toast(`Removing ${fileToRemove.url}`);
      return {
        [listType]: state[listType].filter(
          (file) => file.url !== fileToRemove.url
        ),
      };
    });
  },

  resetFields: () =>
    set({
      title: "",
      description: "",
      course: "",
      type: "",
      files: [],
      existingFiles: [],
      success: false,
      error: null,
    }),

  // Form Validation
  isFormValid: () => {
    const { title, description, course, type, files } = get();
    
    if (!title || !description || !course || !type) {
      toast.error("Please fill all fields.");
      return false;
    }
    if (files.length === 0) {
      const sure = confirm(
        "Are you sure you want to continue without adding any new files?"
      );
      return sure;
    }
    return true;
  },

  // Upload Logic
  uploadResource: async (editId) => {
    set({ isLoading: true });

    try {
      // Get current user
      const user = useAuthStore.getState().user;
      if (!user || !user.uid) {
        toast.error("User not authenticated. Please log in.");
        set({ isLoading: false });
        return;
      }

      // Validate form
      if (!get().isFormValid()) {
        set({ isLoading: false });
        return;
      }

      // Prepare data and form
      const { title, description, course, type, files,existingFiles } = get();
      const data = {
        title,
        description,
        course,
        type,
        postedBy: { uid: user.uid, name: user.name },
        spaceId: user.department_space.spaceId,
        departmentId: user.departmentId,
        schoolId: user.schoolId,
        level: user.level,
        files: existingFiles
      };

      const formData = new FormData();
      formData.append("resourceType", "resources");
      formData.append("data", JSON.stringify(data));
      files.forEach(({ file }) => formData.append("newFiles", file));

      // API Call
      const endpoint = editId
        ? "/api/space-resources/update"
        : "/api/space-resources/create";

      if (editId) formData.append("id", editId);

      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.status.toString().startsWith("2")) {
        throw new Error("Upload failed");
      }

      toast.success("Resource uploaded successfully!");
      get().resetFields();
    } catch (error) {
      toast.error("Error uploading resource.");
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useResourceStore;
