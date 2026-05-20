import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  name: string;
  email: string;
  phone?: string;
};

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      signIn: (user) => set({ user, isAuthenticated: true }),
      signOut: () => set({ user: null, isAuthenticated: false }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "ember-auth",
      skipHydration: true,
      onRehydrateStorage: () => (state, error) => {
        if (!error) state?.setHasHydrated(true);
      },
    },
  ),
);
