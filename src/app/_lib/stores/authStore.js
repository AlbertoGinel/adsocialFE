// src/app/_lib/stores/authStore.js
import { create } from "zustand";
import config from "../../../app/config";

const useAuthStore = create((set) => ({
  token: null,
  isAuthenticated: false,
  login: async (username, password) => {
    try {
      const response = await fetch(`${config.baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Failed to log in");

      const data = await response.json();
      const token = data.token;

      // Update the store with the token and set isAuthenticated to true
      set({ token, isAuthenticated: true });
    } catch (error) {
      console.error("Login failed:", error);
      set({ token: null, isAuthenticated: false });
    }
  },
  logout: () => set({ token: null, isAuthenticated: false }),
}));

export default useAuthStore;
