import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./authStore";
import { toast } from "react-toastify";

const useManageSpaceStore = create((set, get) => ({
  approvedUsers: [],
  pendingUsers: [],
  loading: false,
  error: null,
  success: false,
  response: null,

  fetchMembers: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.email)
      return set({ error: "User not authenticated", loading: false });

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

  makeJoinDecision: async (uid, decision) => {
    const { user } = useAuthStore.getState();
    const { pendingUsers, approvedUsers } = get();
    if (!user?.uid) return set({ error: "Admin not authenticated" });

    set({ loading: true });
    const toastId = toast.loading('Making Decision...')
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

          toast.dismiss(toastId)
          toast.success("Decision Made Successfully!")
        }

        set({ pendingUsers: updatedPending, loading: false });
      }
    } catch (err) {
      toast.dismiss(toastId)
      toast.error("An Error Occured In Decision")
      set({ error: err.message, loading: false });
    }
  },

  removeUserFromSpace: async (uid, reason) => {
    const { user } = useAuthStore.getState();
    const { approvedUsers } = get();
    if (!user?.uid) return set({ error: "Admin not authenticated" });

    set({ loading: true });
    const toastId = toast.loading("Removing User...");


    try {
      const res = await axios.post("/api/department/remove-user", {
        userId: uid,
        adminId: user.uid,
        reason,
      });

      if (res.status === 200) {
        toast.dismiss(toastId)
        toast.success("User removed successfully!")
        set({
          approvedUsers: approvedUsers.filter((u) => u.uid !== uid),
          loading: false,
        });
      }
    } catch (err) {
      console.error("Remove error", err);
      toast.update(toastId, {
        render: "Upload failed. Please try again.",
        type: "error",
        isLoading: false
      })
      set({ error: err?.message, loading: false });
    }
  },

  addSpaceAdmin: async ({ email, permissions }) => {
    const { user } = useAuthStore.getState();
    const { approvedUsers } = get();
    const { schoolId, departmentId, department_space, level } = user;

    set({ loading: true, success: false, error: null });

    try {
      await axios.post("/api/department/add-space-admin", {
        email,
        schoolId,
        departmentId,
        spaceId: department_space.spaceId,
        level,
        permissions,
      });

      const updatedUsers = approvedUsers.map((u) => {
        if (u.email !== email) return u;

        const existing = u.department_space?.permissions || [];
        return {
          ...u,
          department_space: {
            ...u.department_space,
            permissions: Array.from(new Set([...existing, ...permissions])),
          },
        };
      });

      set({ approvedUsers: updatedUsers, loading: false });
    } catch (err) {
      set({
        loading: false,
        error:
          err?.response?.data?.message || err.message || "Something went wrong",
      });
    }
  },

  updateSpaceAdmin: async ({ email, permissions }) => {
    set({ loading: true });
    const { user } = useAuthStore.getState();
    const { schoolId, departmentId, department_space, level } = user;

    try {
      await axios.post("/api/department/update-admin", {
        email,
        schoolId,
        departmentId,
        spaceId: department_space.spaceId,
        level,
        permissions,
      });

      set({
        approvedUsers: get().approvedUsers.map((u) =>
          u.email === email
            ? { ...u, department_space: { ...u.department_space, permissions } }
            : u
        ),
        success: true,
      });
    } catch (err) {
      set({ error: err?.response?.data?.message || err.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useManageSpaceStore;
