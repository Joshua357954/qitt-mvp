import { create } from "zustand";
import Cookies from "js-cookie";

const useAuthStore = create((set) => ({
  user: JSON.parse(Cookies.get("user") || "null"), // Initialize user state from cookies

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

  // Logout function to clear state and cookies
  logout: () => {
    set({ user: null });
    Cookies.remove("user");
  },
}));

export default useAuthStore;
