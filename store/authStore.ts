// store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create((set: any, get: any) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  setAccessToken: (token: string | null) => set({ accessToken: token }),
  setUser: (user: any | null) => set({ user }),

  login: async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // ensure cookies are sent with the request
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
     
      if (res.ok) {

        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.message
        });
        return true;
      } else {
        alert("Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  },

  logout: async () => {
    try {
      // Assuming you have an API endpoint to handle logout
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // make sure cookies are included
      });
      set({ accessToken: null, refreshToken: null, user: null});
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  refreshAccessToken: async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // make sure cookies are included
      });

      const data = await res.json();
      if (res.ok) {
    
        set({ accessToken: data.accessToken });
        return true;
      } else {
        
        set({ accessToken: null });
        console.error('Refresh token failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      set({ accessToken: null });
      return false;
    }
  },
}));

export default useAuthStore;
