import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./authStore";

const useDepartmentStore = create((set, get) => ({
  courses: [],
  loading: false,
  error: null,

  // Fetch courses based on user data from useAuthStore
  fetchCourses: async () => {
    const { user } = useAuthStore.getState();
    const { schoolId, departmentId, level } = user;

    if (!schoolId || !departmentId || !level) {
      console.warn("⚠️ Can't fetch courses: missing user data for filters");
      set({ error: "Missing user data for filters" });
      return;
    }

    set({ loading: true, error: null });

    try {
      const params = {
        schoolId,
        departmentId,
        level,
        spaceId: user.department_space?.spaceId,
      };

      // Making an Axios GET request with query parameters
      const { data } = await axios.get("/api/courses/get", { params });

      if (data && data.courses) {
        console.log("📚 Courses fetched:", data.courses);
        set({ courses: data.courses });
      } else {
        console.error("❌ Error fetching courses:", data.error);
        set({ error: data.error || "Error fetching courses" });
      }
    } catch (err) {
      console.error("🔥 Network error:", err.response || err.message);
      set({ error: "Network error" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useDepartmentStore;
