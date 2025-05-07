import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast"; // Using react-hot-toast for notifications
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

  setCourse: (course) => set({ course }),
  setExistingFiles: (existingFiles) => set({existingFiles}),
  setDescription: (description) => set({ description }),
  setDateGiven: (dateGiven) => set({ dateGiven }),
  setDueDate: (dueDate) => set({ dueDate }),

  addFiles: (newFiles) =>
    set((state) => ({ files: [...state.files, ...newFiles] })),

  removeFile: (fileToRemove) => {
    set((state) => {
      // Check if the file is in existingFiles or files
      const isExistingFile = state.existingFiles.some(
        (file) => file.url === fileToRemove.url
      );
      // Remove the file from the correct list (existingFiles or files)
      const updatedFiles = isExistingFile
        ? state.existingFiles.filter((file) => file.url !== fileToRemove.url)
        : state.files.filter((file) => file.url !== fileToRemove.url);
      // Update the respective list in state
      return isExistingFile
        ? { existingFiles: updatedFiles }
        : { files: updatedFiles };
    });
  },

  uploadAssignment: async () => {
    set({ isLoading: true });

    const { course, description, dateGiven, dueDate, files } = get();

    try {
      const user = useAuthStore.getState().user;
      if (!user || !user.uid) {
        toast.error("User not authenticated. Please log in.");
        set({ isLoading: false });
        return;
      }

      if (!course || !description || !dueDate || files.length === 0) {
        toast.error("Please fill all fields and upload at least one file.");
        set({ isLoading: false });
        return;
      }

      const toastId = toast.loading("Uploading Assignment...");

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
      };

      const formData = new FormData();
      formData.append("resourceType", "assignments");
      formData.append("data", JSON.stringify(data));
      files.forEach(({ file }) => {
        formData.append("files", file);
      });

      const response = await axios.post(
        "/api/space-resources/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss(toastId);

      if (response.status !== 200) {
        throw new Error("Failed to upload");
      }

      toast.success("Assignment uploaded successfully!");

      set({
        success: true,
        course: "",
        description: "",
        dateGiven: "",
        dueDate: "",
        files: [],
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
