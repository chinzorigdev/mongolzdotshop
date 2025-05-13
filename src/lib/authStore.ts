import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.role === "admin",
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
