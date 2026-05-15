import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role?: 'passenger' | 'rider';
  profileCompleted?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: 'passenger' | 'rider') => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'dummy-user-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'passenger', // Change to 'rider' to test rider features
    profileCompleted: true
  },
  isLoading: false,
  setUser: (user) => set({ user }),
  setRole: (role) => set((state) => ({
    user: state.user ? { ...state.user, role, profileCompleted: true } : null
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ user: null }),
}));
