"use client"

import { create } from "zustand";

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,

  login: (token, user) => {
    localStorage.setItem("token", token);
    set({ token, user, loading: false });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, loading: false });
  },

  hydrate: () => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally, decode JWT to get user info
      set({ token, user: null, loading: false }); 
    } else {
      set({ token: null, user: null, loading: false });
    }
  },
}));
