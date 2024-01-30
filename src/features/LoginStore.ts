import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

interface BurritoUser {
  name: string;
  display: string;
  url: string;
  id: number;
}

interface LoginState {
  user?: BurritoUser;
  token?: string;
  setToken: (token: string) => void;
  setUser: (user: BurritoUser) => void;
  logout: () => void;
}

export const useLoginStore = create<LoginState>()(
  devtools(
    persist(
      (set, get) => ({
        user: undefined,
        token: undefined,
        setToken: (token: string) => set({ token }),
        setUser: (user: BurritoUser) => set({ user }),
        logout: () => set({ user: undefined, token: undefined }),
      }),
      {
        name: "login-store",
      }
    )
  )
);
