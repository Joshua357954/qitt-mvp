// stores/useAnnouncementStore.js
import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../authStore";
import useDepartmentStore from "../departmentStore";


const useAnnouncementStore = create((set) => ({
  loading: false,
  success: false,
  error: null,

  deleteAnnouncent: async() => {
    
  },

  // Combined function to post or update an announcement
  postAnnouncement: async ({ title, message, priority, tags, editId }) => {
    const user = useAuthStore.getState().user;
    const { updateItem } = useDepartmentStore.getState()
    set({ loading: true, success: false, error: null });
    toast.loading(
      editId ? "Updating Announcement..." : "Adding Announcement..."
    );

    const data = {
      postedBy: { uid: user.uid, name: user.name },
      spaceId: user.department_space.spaceId,
      departmentId: user.departmentId,
      schoolId: user.schoolId,
      level: user.level,
      title,
      message,
      priority,
      tags,
    };

    try {
      // If editId is present, it's an update (PUT), otherwise it's a new post (POST)
      let res;

      if (editId) {
        res = await axios.post(`/api/space-resources/update`, {
          resourceType: "announcements",
          id: editId,
          data,
        });
        updateItem('announcements', { id: editId, ...data });
      } else {
        res = await axios.post("/api/space-resources/create", {
          resourceType: "announcements",
          data,
        });
      }
      

      set({ loading: false, success: true });
      toast.dismiss();
      toast.success(
        editId ? "📢 Announcement updated!" : "📢 Announcement posted!"
      );
      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (editId
          ? "Failed to update announcement."
          : "Failed to post announcement.");
      set({ loading: false, success: false, error: errorMsg });
      toast.dismiss();
      toast.error(errorMsg);
    }
  },
}));

export default useAnnouncementStore;
