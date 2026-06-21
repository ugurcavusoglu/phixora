import { create } from 'zustand';
import { getMe } from '../api/auth';

interface User { id: string; name: string; email: string; gems: number; tier: string; billing: string; referralCode: string; }

interface AuthState {
  user: User | null;
  token: string | null;
  setToken: (token: string) => void;
  setGems: (gems: number) => void;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  setGems: (gems) => set((s) => s.user ? { user: { ...s.user, gems } } : {}),

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchMe: async () => {
    try {
      const { data } = await getMe();
      set({ user: data });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },
}));
