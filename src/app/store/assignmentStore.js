import { create } from "zustand";
import axios from "axios";
import { baseUrl } from "@/utils/utils";

const useAssignmentStore = create((set, get) => ({
  assignments: null,
  isLoading: false,
  fetchAssignments: async (department, year) => {
    if (get().assignments) return; // ✅ Prevent duplicate API calls
    set({ isLoading: true });

    try {
      const response = await axios.get(
        `${baseUrl}/api/assignments/${department}/${year}`
      );
      set({ assignments: response.data, isLoading: false });
      console.log(response.data);
    } catch (error) {
      console.error("Error getting assignments:", error?.message);
      set({ isLoading: false });
    }
  },
}));

export default useAssignmentStore;
