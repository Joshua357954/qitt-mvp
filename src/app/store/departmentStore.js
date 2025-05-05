import { create } from "zustand";
import toast from "react-hot-toast";
import useAuthStore from "./authStore";
import { apiFetch, validateUserData, handleStoreError, handleStoreSuccess } from "@/utils/utils";

const useDepartmentStore = create((set, get) => ({
  // Resource states
  courses: [],
  announcements: [],
  timetable: [],
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
        toast.success("Resource Deleted");
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

    const validation = validateUserData({ schoolId, departmentId, level });
    if (!validation.valid) {
      return handleStoreError(set, validation.message);
    }

    set({ loading: true, error: null });

    const { success, data, error } = await apiFetch(
      "/api/courses/get",
      {
        schoolId,
        departmentId,
        level,
        spaceId: department_space?.spaceId,
      },
      "courses"
    );

    if (success) {
      console.log(data.courses)
      set({ courses: data.courses });
      handleStoreSuccess(set, "Courses fetched successfully!");
    } else {
      handleStoreError(set, error || "Unknown error fetching courses.");
    }

    set({ loading: false });
  },

  // Fetch announcements based on user info
  fetchAnnouncements: async () => {
    const { user } = useAuthStore.getState();
    const { schoolId, departmentId, level, department_space } = user || {};
    const spaceId = department_space?.spaceId;

    const validation = validateUserData({ schoolId, departmentId, level });
    if (!validation.valid || !spaceId) {
      return handleStoreError(
        set,
        "Missing user data for fetching announcements."
      );
    }

    set({ loading: true, error: null });

    const { success, data, error } = await apiFetch(
      "/api/space-resources/get",
      {
        resourceType: "announcements",
        spaceId,
        schoolId,
        departmentId,
        level,
      },
      "announcements"
    );

    if (success) {
      set({ announcements: data });
      handleStoreSuccess(set, "Announcements fetched successfully!");
    } else {
      handleStoreError(set, error || "Failed to fetch announcements.");
    }

    set({ loading: false });
  },

  // Fetch timetable based on user info
  fetchTimetable: async () => {
    const { user } = useAuthStore.getState();
    const { schoolId, departmentId, level, department_space } = user || {};
    const spaceId = department_space?.spaceId;

    const validation = validateUserData({ schoolId, departmentId, level });
    if (!validation.valid || !spaceId) {
      return handleStoreError(set, "Missing user data for fetching timetable.");
    }

    set({ loading: true, error: null });

    const { success, data, error } = await apiFetch(
      "/api/space-resources/get",
      {
        resourceType: "timetables",
        spaceId,
        schoolId,
        departmentId,
        level,
      },
      "timetable"
    );

    if (success) {
      console.log(data)
      set({ timetable: data });
      handleStoreSuccess(set, "Timetable fetched successfully!");
    } else {
      handleStoreError(set, error || "Failed to fetch timetable.");
    }

    set({ loading: false });
  },
}));

export default useDepartmentStore;
