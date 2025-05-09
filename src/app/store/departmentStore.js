import { create } from "zustand";
import toast from "react-hot-toast";
import useAuthStore from "./authStore";
import {
  apiFetch,
  validateUserData,
  handleStoreError,
  handleStoreSuccess,
} from "@/utils/utils";
import axios from "axios";

const useDepartmentStore = create((set, get) => ({
  // Resource states
  courses: [],
  announcements: [],
  timetable: [],
  assignments: [],
  resources: [],
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

  /**
   * Reusable function to fetch content based on type
   * @param {string} type - The type of content to fetch (e.g., "courses", "announcements", "resources")
   * @param {object} options - Optional parameters for additional configurations
   */
  fetchContent: async (type, options = {}) => {
    const { user } = useAuthStore.getState();
    const { schoolId, departmentId, level, department_space } = user || {};
    const spaceId = department_space?.spaceId;

    // Validate user data before making the request
    const validation = validateUserData({ schoolId, departmentId, level });
    if (!validation.valid || (!spaceId && type !== "courses")) {
      return handleStoreError(
        set,
        `Missing required user data for fetching ${type}.`
      );
    }

    set({ loading: true, error: null });

    // Dynamically set the resourceType for API request
    const resourceType = get().resourceTypes[type] || type;

    const { success, data, error } = await apiFetch(
      "/api/space-resources/get",
      {
        resourceType,
        schoolId,
        departmentId,
        level,
        spaceId,
        ...options, // Allow additional query params if needed
      },
      type
    );

    if (success) {
      set({ [type]: data });
      handleStoreSuccess(
        set,
        `${type.charAt(0).toUpperCase() + type.slice(1)} fetched successfully!`
      );
    } else {
      handleStoreError(set, error || `Failed to fetch ${type}.`);
    }

    set({ loading: false });
  },

  /**
   * Fetch Specific Resources
   */
  fetchCourses: async () => {
    await get().fetchContent("courses");
  },

  fetchAnnouncements: async () => {
    await get().fetchContent("announcements");
  },

  fetchTimetable: async () => {
    await get().fetchContent("timetable");
  },

  fetchAssignments: async () => {
    await get().fetchContent("assignments");
  },

  fetchResources: async () => {
    await get().fetchContent("resources");
  },

  /**
   * Dynamically delete an item by ID
   */
  deleteItem: async (resourceType, id) => {
    try {
      const response = await axios.post("/api/space-resources/delete", {
        resourceType,
        id,
      });
      if (response.status === 200) {
        toast.success("Resource Deleted");
        const updatedList = get()[resourceType].filter(
          (item) => item.id !== id
        );
        set({ [resourceType]: updatedList });
      } else throw new Error("Failed to delete resource");
    } catch (error) {
      toast.error(
        `Error: ${
          error.response?.data?.message ||
          error.message ||
          "Something went wrong"
        }`
      );
    }
  },

  /**
   * Dynamically get an item by ID, fetch data if needed
   */
  getItem: async (type, id) => {
    const state = get();
    if (!state[type] || state[type].length === 0) {
      await get().fetchContent(type); // Fetch resource if empty
    }
    const updatedState = get();
    return updatedState[type]?.find((item) => item.id === id) || null;
  },

  /**
   * Replace item in state by ID
   */
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
}));

export default useDepartmentStore;
