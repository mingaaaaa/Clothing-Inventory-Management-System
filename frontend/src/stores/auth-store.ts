import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, MenuItem } from '@clothing-inventory/shared';
import { TOKEN_KEYS } from '@/lib/constants';

interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  menus: MenuItem[];
  isAuthenticated: boolean;
  setAuth: (auth: { accessToken: string; user: UserProfile; menus: MenuItem[] }) => void;
  clearAuth: () => void;
  hasMenu: (menuKey: string) => boolean;
}

function setAuthCookie(value: string) {
  document.cookie = `${TOKEN_KEYS.AUTH_STATUS}=${value}; path=/; max-age=604800; SameSite=Lax`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      menus: [],
      isAuthenticated: false,

      setAuth: ({ accessToken, user, menus }) => {
        setAuthCookie('true');
        set({ accessToken, user, menus, isAuthenticated: true });
      },

      clearAuth: () => {
        setAuthCookie('');
        set({ accessToken: null, user: null, menus: [], isAuthenticated: false });
      },

      hasMenu: (menuKey: string) => {
        return get().menus.some((m) => m.key === menuKey);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        menus: state.menus,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
