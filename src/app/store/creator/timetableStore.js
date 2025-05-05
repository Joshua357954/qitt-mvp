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

  setTimetable: (data) => set({ timetable: data }),

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

  uploadTimetable: async (editId) => {
    const { timetable } = get();

    if (!timetable.length || !hasNonEmptyEntries({ timetable })) {
      toast.error("⚠️ No timetable data to upload!");
      return;
    }

    set({ isLoading: true });
    const loadingToastId = toast.loading(
      editId ? "Updating Timetable..." : "Uploading Timetable..."
    );

    try {
      const user = useAuthStore.getState().user;

      const data = {
        postedBy: {
          uid: user.uid,
          name: user.name,
        },
        spaceId: user.department_space.spaceId,
        departmentId: user.departmentId,
        schoolId: user.schoolId,
        level: user.level,
        timetable,
      };

      const url = editId
        ? "/api/space-resources/update"
        : "/api/space-resources/create";

      const payload = {
        resourceType: "timetables",
        data,
        ...(editId && { id: editId }),
      };

      const response = await axios.post(url, payload);

      if (![200, 201].includes(response.status)) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      toast.dismiss(loadingToastId);
      toast.success(
        editId
          ? "📅 Timetable updated successfully!"
          : "📅 Timetable uploaded successfully!"
      );

      return response.data;
    } catch (error) {
      toast.dismiss(loadingToastId);
      const errorMsg =
        error.response?.data?.message ||
        (editId
          ? "Failed to update timetable."
          : "Failed to upload timetable.");

      toast.error(`❌ ${errorMsg}`);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTimetableStore;
