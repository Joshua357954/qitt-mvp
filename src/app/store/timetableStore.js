import { create } from "zustand";
import axios from "axios";
import { baseUrl } from "@/utils/utils";

const useTimetableStore = create((set, get) => ({
  timetable: null,
  isLoading: false,
  fetchTimetable: async (department, year) => {
    if (get().timetable) return; // ✅ Prevent duplicate API calls
    set({ isLoading: true });

    try {
      const response = await axios.get(
        `${baseUrl}/api/timetable/all/${department}/${year}`
      );
      set({ timetable: response.data.allTimetables, isLoading: false });
      console.log("Timetable Data > : ", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      set({ isLoading: false });
    }
  },
}));

export default useTimetableStore;
