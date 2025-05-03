import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "./authStore";
import { handleStoreError, handleStoreSuccess } from "@/utils/utils";
// import Announcement from "../creator/announcements/page";

const resourceTypes = { Announcements: "announcements" };

const useDepartmentStore = create((set, get) => ({
  courses: [],
  announcements: [],
  loading: false,
  error: null,

  fetchCourses: async () => {
    const { user } = useAuthStore.getState();
    const { schoolId, departmentId, level, department_space } = user || {};

    if (!schoolId || !departmentId || !level) {
      return handleStoreError(
        set,
        "Missing user data: schoolId, departmentId, or level."
      );
    }

    set({ loading: true, error: null });

    try {
      const { data } = await axios.get("/api/courses/get", {
        params: {
          schoolId,
          departmentId,
          level,
          spaceId: department_space?.spaceId,
        },
      });

      if (data?.courses) {
        set({ courses: data.courses });
        handleStoreSuccess(set, "Courses fetched successfully!");
      } else {
        handleStoreError(set, data?.error || "Unknown error fetching courses.");
      }
    } catch (err) {
      handleStoreError(
        set,
        err.response?.data?.error || "Network error while fetching courses."
      );
    } finally {
      set({ loading: false });
    }
  },

  fetchAnnouncements: async () => {
    const { user } = useAuthStore.getState();
    const { schoolId, departmentId, level, department_space } = user || {};
    const spaceId = department_space?.spaceId;

    if (!schoolId || !departmentId || !level || !spaceId) {
      return handleStoreError(
        set,
        "Missing user data for fetching announcements."
      );
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.get("/api/space-resources/get", {
        params: {
          resourceType: resourceTypes.Announcements,
          spaceId,
          schoolId,
          departmentId,
          level,
        },
      });

      set({ announcements: response.data });
      handleStoreSuccess(set, "Announcements fetched successfully!");
    } catch (err) {
      handleStoreError(
        set,
        err.response?.data?.error || "Failed to fetch announcements."
      );
    } finally {
      set({ loading: false });
    }
  },
}));

export default useDepartmentStore;
