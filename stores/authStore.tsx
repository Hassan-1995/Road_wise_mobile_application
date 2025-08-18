import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = { id?: string; email?: string } | null;

type AuthState = {
  isLoggedIn: boolean;
  user: User;
  login: (user?: User) => void; // fake login for now
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (user) => set({ isLoggedIn: true, user: user ?? null }),
      logout: () => set({ isLoggedIn: false, user: null }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
