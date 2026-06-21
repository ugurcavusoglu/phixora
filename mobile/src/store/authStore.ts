import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { getMe } from '../api/auth';

interface User { id: string; name: string; email: string; gems: number; tier: string; referralCode: string; }

interface AuthState {
  user: User | null;
  token: string | null;
  ready: boolean; // initial token load finished
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setGems: (gems: number) => void;
  setTier: (tier: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  ready: false,

  setToken: async (token) => {
    await SecureStore.setItemAsync('token', token);
    set({ token });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ user: null, token: null });
  },

  loadToken: async () => {
    const token = await SecureStore.getItemAsync('token');
    set({ token, ready: true });
    if (token) get().fetchMe();
  },

  fetchMe: async () => {
    try {
      const { data } = await getMe();
      set({ user: data });
    } catch {
      await SecureStore.deleteItemAsync('token');
      set({ user: null, token: null });
    }
  },

  setGems: (gems) => set((s) => s.user ? { user: { ...s.user, gems } } : {}),
  setTier: (tier) => set((s) => s.user ? { user: { ...s.user, tier } } : {}),
}));
