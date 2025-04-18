import { create } from "zustand";
import Cookies from "js-cookie";

const useAuthStore = create((get,set) => ({
  user: (() => {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null;
    try {
      return JSON.parse(userCookie);
    } catch (error) {
      console.error("Invalid user cookie format", error);
      Cookies.remove("user");
      return null;
    }
  })(), // Holds user data directly from cookies

  // Store user data in state and cookies
  setUser: (user, expiresInMinutes = 60) => {
    set({ user });
    console.log(user)
    const expires = new Date(new Date().getTime() + expiresInMinutes * 60000);
    Cookies.set("user", JSON.stringify(user), {
      expires,
      secure: true,
      sameSite: "Strict",
    });
  },

  updateUser: (newData, expiresInMinutes = 60) => {
    const currentUser = get().user || {};
    const updatedUser = { ...currentUser, ...newData };
    set({ user: updatedUser });
    const expires = new Date(new Date().getTime() + expiresInMinutes * 60000);
    Cookies.set("user", JSON.stringify(updatedUser), { expires, secure: true, sameSite: "Strict" });
  },


  // Logout function to clear state and cookies
  logout: () => {
    set({ user: null });
    Cookies.remove("user");
  },
}));

export default useAuthStore;
