import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../authStore";

const useCourseStore = create((set, get) => ({
  course: {
    code: "",
    title: "",
    creditUnit: "",
    outline: "",
    lecturers: "",
  },
  isSuccess: null,
  isUploading: false,
  isLoading: false,

  // Update single field in course
  updateCourse: (field, value) => {
    set((state) => ({
      course: { ...state.course, [field]: value },
    }));
  },

  // Set entire course data (for edit mode)
  setCourseData: (data) => {
    set({
      course: {
        code: data.code || "",
        title: data.title || "",
        creditUnit: data.creditUnit || "",
        outline: data.outline || "",
        lecturers: data.lecturers || "",
      },
    });
  },

  // Reset course to initial state
  resetCourse: () => {
    set({
      course: {
        code: "",
        title: "",
        creditUnit: "",
        outline: "",
        lecturers: "",
      },
    });
  },

  // Fetch course data for editing
  fetchCourse: async (courseId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/api/courses/${courseId}`);
      if (response.status === 200) {
        set({
          course: {
            code: response.data.code || "",
            title: response.data.title || "",
            creditUnit: response.data.creditUnit || "",
            outline: response.data.outline || "",
            lecturers: response.data.lecturers || "",
          },
        });
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course data");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Add new course (client-side only)
  addCourse: () => {
    const { course } = get();
    if (!course.code.trim() || !course.title.trim()) {
      toast.error("Course Code and Title are required!");
      return;
    }
    return course; // Return data for parent component to handle
  },

  // Upload/Update course (API call)
  uploadCourses: async (courseId = null) => {
    const { course } = get();
    const { user } = useAuthStore.getState();

    if (
      !course.code.trim() ||
      !course.title.trim() ||
      !course.lecturers.trim()
    ) {
      toast.error("Course Code, Title, and Lecturers are required!");
      set({ isSuccess: false });
      return;
    }

    const isUpdate = Boolean(courseId);
    const toastId = toast.loading(
      isUpdate ? "Updating course..." : "Uploading course..."
    );

    set({ isUploading: true, isSuccess: null });

    try {
      const payload = {
        ...course,
        postedBy: user.uid,
        schoolId: user.schoolId,
        departmentId: user.departmentId,
        level: user.level,
        spaceId: user.department_space?.spaceId,
      };

      let response;
      if (isUpdate) {
        response = await axios.put(`/api/courses/${courseId}`, payload);
      } else {
        response = await axios.post("/api/courses/add", payload);
      }

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(isUpdate ? "Update failed" : "Upload failed");
      }

      // Only reset if not in update mode
      if (!isUpdate) {
        set({
          course: {
            code: "",
            title: "",
            creditUnit: "",
            outline: "",
            lecturers: "",
          },
        });
      }

      set({ isSuccess: true });
      toast.update(toastId, {
        render: isUpdate
          ? "Course updated successfully!"
          : "Course uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });

      return response.data;
    } catch (error) {
      console.error(isUpdate ? "Update error:" : "Upload error:", error);
      set({ isSuccess: false });

      toast.update(toastId, {
        render: isUpdate
          ? "Update failed. Please try again."
          : "Upload failed. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
      throw error;
    } finally {
      set({ isUploading: false });
    }
  },
}));

export default useCourseStore;
