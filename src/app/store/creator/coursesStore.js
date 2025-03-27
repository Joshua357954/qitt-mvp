import { create } from "zustand";
import axios from "axios";

const useCourseStore = create((set, get) => ({
  course: {
    code: "",
    title: "",
    creditUnit: "",
    outline: "",
    lecturer: "",
  },
  courses: [],
  isUploading: false,

  // Handle input changes
  updateCourse: (field, value) => {
    set((state) => ({
      course: { ...state.course, [field]: value },
    }));
  },

  // Add a new course with validation
  addCourse: () => {
    const { course, courses } = get();
    if (!course.code.trim() || !course.title.trim()) {
      alert("Course Code and Title are required!");
      return;
    }
    set({
      courses: [...courses, course],
      course: {
        code: "",
        title: "",
        creditUnit: "",
        outline: "",
        lecturer: "",
      },
    });
  },

  // Upload courses to API
  uploadCourses: async () => {
    const { courses } = get();
    if (courses.length === 0) {
      alert("No courses to upload!");
      return;
    }

    set({ isUploading: true });
    try {
      const response = await axios.post("/api/courses", { courses });

      if (response.status !== 200) throw new Error("Upload failed");

      set({ courses: [] }); // Clear after successful upload
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      set({ isUploading: false });
    }
  },
}));

export default useCourseStore;
