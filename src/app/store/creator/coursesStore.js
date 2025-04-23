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

  updateCourse: (field, value) => {
    set((state) => ({
      course: { ...state.course, [field]: value },
    }));
  },

  addCourse: () => {
    const { course } = get();
    if (!course.code.trim() || !course.title.trim()) {
      toast.error("Course Code and Title are required!");
      return;
    }

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

  uploadCourses: async () => {
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

    const toastId = toast.loading("Uploading course...");

    set({ isUploading: true, isSuccess: null });
    try {
      const response = await axios.post("/api/courses/add", {
        ...course,
        postedBy: user.uid,
        schoolId: user.schoolId,
        departmentId: user.departmentId,
        level: user.level,
        spaceId: user.department_space.spaceId,
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Upload failed");
      }

      set({
        course: {
          code: "",
          title: "",
          creditUnit: "",
          outline: "",
          lecturers: "",
        },
        isSuccess: true,
      });

      toast.update(toastId, {
        render: "Course uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
    } catch (error) {
      console.error("Upload error:", error);
      set({ isSuccess: false });

      toast.update(toastId, {
        render: "Upload failed. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
    } finally {
      set({ isUploading: false });
    }
  },
}));

export default useCourseStore;
