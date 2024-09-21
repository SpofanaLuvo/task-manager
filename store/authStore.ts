import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const isClient = typeof window !== 'undefined';

const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => {
        set({ user });
      },

      login: async (email, password) => {
        try {
          const res = await axios.post('/api/auth/login', { email, password }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          });

          const data = res.data;

          if (res.status === 200) {
            set({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              user: data.message,
            });
            return true;
          } else {
            alert('Login failed');
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      logout: async () => {
        try {
          await axios.post('/api/auth/logout', {}, { withCredentials: true });
          set({ accessToken: null, refreshToken: null, user: null });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      refreshAccessToken: async () => {
        try {
          const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
          const { accessToken } = response.data;
          set({ accessToken });
          return true;
        } catch (error) {
          console.error('Failed to refresh access token:', error);
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
