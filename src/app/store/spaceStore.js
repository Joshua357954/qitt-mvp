import { create } from "zustand";
import useAuthStore from "./authStore"; // Assuming the user store is in a separate file.

const useSpaceStore = create((set, get) => ({
  name: "",
  bio: "",
  visibility: "private",
  isClassRep: false,
  loading: false,
  error: null,
  success: false,

  setField: (key, value) => set({ [key]: value }),

  createSpace: async () => {
    const { name, bio, visibility, isClassRep } = get();
    const { user, updateUser } = useAuthStore.getState(); // Get schoolId, departmentId, etc. from auth store.

    if (!isClassRep) {
      set({ error: "You must be the class representative to create a space." });
      return;
    }

    if (!user) {
      alert("User Not Logged In");
      return;
    }

    set({ loading: true, error: null });

    try {
      const res = await fetch("/api/department/create-space", {
        method: "POST",
        body: JSON.stringify({
          name,
          bio,
          visibility,
          schoolId: user.schoolId,
          departmentId: user.departmentId,
          level: user.level,
          uid: user.uid,
          isClassRep,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      updateUser({
        department_space: {
          spaceId: result.spaceId,
          name: result.name,
          status:result.status,
          permissions:result.permissions
        },
      });

      set({ success: true });
      return result;
    } catch (err) {
      set({ error: err.message || "An Error Occurred" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useSpaceStore;
