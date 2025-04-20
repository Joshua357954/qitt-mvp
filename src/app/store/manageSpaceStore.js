import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./authStore";

const useManageSpaceStore = create((set, get) => ({
  approvedUsers: [],
  pendingUsers: [],
  loading: false,
  error: null,
  success: false,
  response: null,

  // Fetch members based on user's department context
  fetchMembers: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.email) {
      return set({ error: "User not authenticated", loading: false });
    }

    const { schoolId, departmentId, level, department_space } = user;
    set({ loading: true, error: null });

    try {
      const { data } = await axios.get("/api/department/get-members", {
        params: {
          spaceId: department_space.spaceId,
          schoolId,
          departmentId,
          level,
        },
      });

      set({
        approvedUsers: data.approved_users,
        pendingUsers: data.pending_users,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Approve or reject a pending user
  makeJoinDecision: async (uid, decision) => {
    const { user } = useAuthStore.getState();
    const { pendingUsers, approvedUsers } = get();

    if (!user?.uid) {
      return set({ error: "Admin not authenticated" });
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
            approvedUser.department_space.status = "approved";
            return set({
              approvedUsers: [...approvedUsers, approvedUser],
              pendingUsers: updatedPending,
              loading: false,
            });
          }
        }

        // If rejected, just update pending list
        set({ pendingUsers: updatedPending, loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Remove a user from the space
  removeUserFromSpace: async (uid, reason) => {
    const { user } = useAuthStore.getState();
    const { approvedUsers } = get();

    if (!user?.uid) {
      return set({ error: "Admin not authenticated" });
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
        set({ approvedUsers: updatedApproved, loading: false });
      }
    } catch (err) {
      console.error("Remove error", err);
      set({ error: err.message, loading: false });
    }
  },

  // Add a space admin with permissions
  addSpaceAdmin: async ({ email, permissions }) => {
    const { user } = useAuthStore.getState();

    const { schoolId, departmentId, department_space, level } = user;

    alert("Add Space Running")

    set({ loading: true, success: false, error: null });

    try {
      const { data } = await axios.post("/api/department/add-space-admin", {
        email,
        schoolId,
        departmentId,
        spaceId: department_space.spaceId,
        level,
        permissions,
      });

      console.log("Data :", data)

      set({ loading: false, response: data });
    } catch (err) {
      set({
        loading: false,
        error:
          err?.response?.data?.message || err.message || "Something went wrong",
      });
    }
  },
}));

export default useManageSpaceStore;
