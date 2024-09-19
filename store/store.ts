import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: {
name: "Luvo Spofana"
  },
  updateUser: (newUser:any) => set((state: any ) =>({
        user: {...state.user, ...newUser}
  }))
}));
