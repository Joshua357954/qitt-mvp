import { create } from "zustand";
import axios from "axios";
import useAuthStore from "../authStore";
import toast from "react-hot-toast";

// Check if there are non-empty entries in the timetable
const hasNonEmptyEntries = (state) =>
  Array.isArray(state.timetable) &&
  state.timetable.some(
    (entry) =>
      (entry.course?.trim() && entry.course.trim() !== "") ||
      (entry.venue?.trim() && entry.venue.trim() !== "") ||
      (entry.start?.trim() && entry.start.trim() !== "") ||
      (entry.end?.trim() && entry.end.trim() !== "")
  );

const useTimetableStore = create((set, get) => ({
  day: "friday",
  isLoading: false,
  timetable: [],

  setDay: (day) => set({ day }),

  addEntry: () =>
    set((state) => ({
      timetable: [
        ...state.timetable,
        {
          id: Date.now(),
          day: state.day,
          venue: "",
          course: "",
          start: "",
          end: "",
        },
      ],
    })),

  updateEntry: (id, field, value) =>
    set((state) => ({
      timetable: state.timetable.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    })),

  removeEntry: (id) =>
    set((state) => ({
      timetable: state.timetable.filter((entry) => entry.id !== id),
    })),

  uploadTimetable: async () => {
    const { timetable } = get();

    // Check if timetable has valid entries before uploading
    if (timetable.length === 0 || !hasNonEmptyEntries({ timetable })) {
      alert("No timetable data to upload!");
      return;
    }

    set({ isLoading: true });
    try {
      const user = useAuthStore.getState().user;
      const data = {
        postedBy: { uid: user.uid, name: user.name },
        spaceId: user.department_space.spaceId,
        departmentId: user.departmentId,
        schoolId: user.schoolId,
        level: user.level,
        timetable
      };

      toast.loading("Adding Timetable...");

      const response = await axios.post("/api/space-resources/create", {
        resourceType: 'timetable',
        data,
      });

      if (![200, 201].includes(response.status)) throw new Error(`Upload failed with status ${response.status}`);

      alert("Timetable uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload timetable.");
    } finally {
      set({ isLoading: false });
      toast.dismiss();
    }
  },
}));

export default useTimetableStore;
