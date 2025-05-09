import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../authStore";

const useAssignmentStore = create((set, get) => ({
  course: "",
  description: "",
  dateGiven: "",
  dueDate: "",
  files: [],
  existingFiles: [],
  isLoading: false,
  success: false,
  error: null,

  // State Setters
  setCourse: (course) => set({ course }),
  setExistingFiles: (existingFiles) => set({ existingFiles }),
  setDescription: (description) => set({ description }),
  setDateGiven: (dateGiven) => set({ dateGiven }),
  setDueDate: (dueDate) => set({ dueDate }),

  // Add new files to the list
  addFiles: (newFiles) =>
    set((state) => ({ files: [...state.files, ...newFiles] })),

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

  // Helper function to validate form fields
  isFormValid: () => {
    const { course, description, dateGiven, dueDate, files } = get();

    if (!course || !description || !dateGiven || !dueDate) {
      toast.error("Please fill all fields and upload at least one file.");
      return false;
    }
    if (files.length === 0) {
      const sure = confirm(
        "Are you sure you want to Continue without posting any New File"
      );
      return sure;
    }

    return true;
  },

  // Upload Assignment to the API
  uploadAssignment: async (editId) => {
    set({ isLoading: true });

    try {
      // Get the current user
      const user = useAuthStore.getState().user;
      if (!user || !user.uid) {
        toast.error("User not authenticated. Please log in.");
        set({ isLoading: false });
        return;
      }

      // Validate form fields before uploading
      if (!get().isFormValid()) {
        set({ isLoading: false });
        return;
      }

      // Toast for feedback during upload
      const toastId = toast.loading(
        editId ? "Updating Assignment..." : "Uploading Assignment..."
      );

      // Prepare the data payload
      const { course, description, dateGiven, dueDate, files, existingFiles } =
        get();
      const data = {
        course,
        description,
        dateGiven,
        dueDate,
        postedBy: { uid: user.uid, name: user.name },
        spaceId: user.department_space.spaceId,
        departmentId: user.departmentId,
        schoolId: user.schoolId,
        level: user.level,
        files: existingFiles,
      };

      // FormData for file uploads
      const formData = new FormData();
      formData.append("resourceType", "assignments");
      formData.append("data", JSON.stringify(data));
      files.forEach(({ file }) => {
        formData.append("newFiles", file);
      });

      // Conditional logic: update if editId is provided, else create
      let response;
      if (editId) {
        formData.append("id", editId); // Include editId for update
        response = await axios.post("/api/space-resources/update", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.post("/api/space-resources/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Dismiss loading toast
      toast.dismiss(toastId);

      // Handle response status
      if (!response.status.toString().startsWith("2")) {
        throw new Error("Failed to upload");
      }

      // Success feedback
      toast.success(
        editId
          ? "Assignment updated successfully!"
          : "Assignment uploaded successfully!"
      );

      // Clear form state
      set({
        success: true,
        course: "",
        description: "",
        dateGiven: "",
        dueDate: "",
        files: [],
        existingFiles: [],
        error: null,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast.dismiss();
      toast.error("Error uploading assignment.");
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAssignmentStore;
