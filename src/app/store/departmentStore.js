import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "./authStore";
import { handleStoreError, handleStoreSuccess } from "@/utils/utils";

const useDepartmentStore = create((set, get) => ({
  // Resource states
  courses: [],
  announcements: [],
  loading: false,
  error: null,

  // Valid resource types
  resourceTypes: {
    announcements: "announcements",
    assignments: "assignments",
    notes: "notes",
    courses: "courses",
    resources: "resources",
    timetable: "timetable",
  },

  // Dynamically delete an item by ID
  deleteItem: async (resourceType, id) => {
    try {
      const response = await axios.post("/api/space-resources/delete", {
        resourceType,
        id,
      });
      if (response.status === 200) {
        toast.success("Resource Deleted")
      }
      else throw new Error("Failed to delete resource");
    } catch (error) {
      // Handling errors with toast notification
      toast.error(
        `Error: ${
          error.response?.data?.message ||
          error.message ||
          "Something went wrong"
        }`
      );
    }
  },

  // Dynamically get an item by ID, fetch data if needed
  getItem: async (type, id) => {
    const state = get();
    if (!state[type] || state[type].length === 0) {
      const fetchFnName = `fetch${
        type.charAt(0).toUpperCase() + type.slice(1)
      }`;
      const fetchFn = get()[fetchFnName];
      if (typeof fetchFn === "function") await fetchFn(); // Fetch resource if empty
    }
    const updatedState = get();
    return updatedState[type]?.find((item) => item.id === id) || null;
  },

  // Replace item in state by ID
  updateItem: (type, newData) => {
    const state = get();
    if (!state[type]) return;
    const updatedList = state[type].map((item) =>
      item.id === newData.id ? newData : item
    );
    set({ [type]: updatedList });
    toast.success(
      `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`
    );
  },

  // Fetch courses based on user info
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

  // Fetch announcements based on user info
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
          resourceType: "announcements",
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
