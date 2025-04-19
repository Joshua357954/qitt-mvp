import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./authStore";

const useManageSpaceStore = create((set, get) => ({
  approvedUsers: [],
  pendingUsers: [],
  loading: false,
  error: null,

  // Fetch members based on the current user's department context
  fetchMembers: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.email) {
      set({ error: "User not authenticated", loading: false });
      return;
    }

    const { schoolId, departmentId, level, department_space } = user;
    set({ loading: true, error: null });

    try {
      const res = await axios.get("/api/department/get-members", {
        params: {
          spaceId: department_space.spaceId,
          schoolId,
          departmentId,
          level,
        },
      });

      set({
        approvedUsers: res.data.approved_users,
        pendingUsers: res.data.pending_users,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Approve or reject a pending join request
  makeJoinDecision: async (uid, decision) => {
    const { user } = useAuthStore.getState();
    const { pendingUsers, approvedUsers } = get();

    if (!user?.uid) {
      set({ error: "Admin not authenticated" });
      return;
    }

    set({ loading: true });

    try {
      const res = await axios.post(
        "/api/department/handle-space-join-request",
        {
          userId: uid,
          adminId: user.uid,
          decision,
        }
      );

      if (res.status === 200) {
        const updatedPending = pendingUsers.filter((u) => u.id !== uid);

        if (decision === "approved") {
          const approvedUser = pendingUsers.find((u) => u.id === uid);

          if (approvedUser) {
            // Update user status locally
            approvedUser.department_space.status = "approved";

            set({
              approvedUsers: [...approvedUsers, approvedUser],
              pendingUsers: updatedPending,
              loading: false,
            });
            return;
          }
        }

        // If rejected, just remove from pending
        set({
          pendingUsers: updatedPending,
          loading: false,
        });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Remove User From Space
  removeUserFromSpace: async (uid, reason) => {
    const { user } = useAuthStore.getState();
    const { approvedUsers } = get();

    if (!user?.uid) {
      set({ error: "Admin not authenticated" });
      return;
    }

    set({ loading: true });

    try {
      const res = await axios.post("/api/department/remove-user", {
        userId: uid,
        adminId: user.uid,
        reason,
      });

      if (res.status === 200) {
        const updatedApproved = approvedUsers.filter((u) => u.id !== uid);

        set({
          approvedUsers: updatedApproved,
          loading: false,
        });
      }
    } catch (err) {
      console.error("Remove error", err);
      set({ error: err.message, loading: false });
    }
  },
}));

export default useManageSpaceStore;
