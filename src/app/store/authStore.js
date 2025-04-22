import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";
import { departments } from "@/utils/utils";

const useAuthStore = create((set, get) => ({
  user: (() => {
    try {
      const cookie = Cookies.get("user");
      return cookie && cookie !== "undefined" ? JSON.parse(cookie) : null;
    } catch {
      return null;
    }
  })(),

  loading: false,
  error: null,

  // Store user data in state and cookies
  setUser: (user, expiresInMinutes = 60) => {
    set({ user });
    const expires = new Date(new Date().getTime() + expiresInMinutes * 60000);
    Cookies.set("user", JSON.stringify(user), {
      expires,
      secure: true,
      sameSite: "Strict",
    });
  },

  // Update user data in state and cookies
  updateUser: (newData, expiresInMinutes = 60) => {
    const currentUser = get().user || {};
    const updatedUser = { ...currentUser, ...newData };
    set({ user: updatedUser });
    const expires = new Date(new Date().getTime() + expiresInMinutes * 60000);
    Cookies.set("user", JSON.stringify(updatedUser), {
      expires,
      secure: true,
      sameSite: "Strict",
    });
  },

  removeSelfFromSpace: async (reason) => {
    const { user } = get();
    if (!user?.uid) return set({ error: "User not authenticated" });

    set({ loading: true, error: null });

    try {
      const res = await axios.post("/api/department/remove-user", {
        userId: user.uid, 
        reason,
      });

      if (res.status === 200) {
        // Update user state after successful removal
        const updatedUser = { ...user, department_space: {} };
        set({
          user: updatedUser,
          loading: false,
        });

        // Update cookies
        const expires = new Date(new Date().getTime() + 60 * 60000);
        Cookies.set("user", JSON.stringify(updatedUser), {
          expires,
          secure: true,
          sameSite: "Strict",
        });
      }
    } catch (err) {
      console.error("Remove error", err);
      set({ error: err.message, loading: false });
    }
  },

  // Logout function to clear state and cookies
  logout: () => {
    set({ user: null, loading: false, error: null });
    Cookies.remove("user");
  },
}));

export default useAuthStore;
