import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '@/lib/api';
import { jwtDecode } from 'jwt-decode'; // Nous aurons besoin de cette librairie

interface User {
  userId: number;
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (credentials: { username: string; email: string; password: string; role?: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const response = await api.post<{ access_token: string }>('/auth/login', credentials);
        const token = response.data.access_token;
        const decodedToken = jwtDecode<any>(token);
        const user: User = {
          userId: decodedToken.sub,
          username: decodedToken.username,
          role: decodedToken.role
        };

        set({ user, token, isAuthenticated: true });
        localStorage.setItem('access_token', token);
      },

      register: async (credentials) => {
        await api.post('/auth/register', credentials);
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('access_token');
      },

      checkAuth: () => {
        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            const decodedToken = jwtDecode<any>(token);
            const user: User = {
              userId: decodedToken.sub,
              username: decodedToken.username,
              role: decodedToken.role
            };

            // Vérifier si le token est expiré
            if (decodedToken.exp * 1000 < Date.now()) {
              get().logout();
              return;
            }

            set({ user, token, isAuthenticated: true });
          } catch (error) {
            get().logout();
          }
        } else {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage', // nom de l'item dans le localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
