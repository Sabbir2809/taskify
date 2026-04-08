import { AUTH_STORAGE_KEY } from "@/config/constants";
import { removeToken, setToken } from "@/utils/token";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        setToken(token);
        set({ user, isAuthenticated: true });
      },
      clearAuth: () => {
        removeToken();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: ({ user, isAuthenticated }) => ({ user, isAuthenticated }),
    },
  ),
);
