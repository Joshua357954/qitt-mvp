import { create } from "zustand";

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

    if (timetable.length === 0) {
      alert("No timetable data to upload!");
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch("/api/uploadTimetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timetable }),
      });

      if (!response.ok) throw new Error("Upload failed");
      alert("Timetable updated successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload timetable.");
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTimetableStore;
