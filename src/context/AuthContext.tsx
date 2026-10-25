import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, role?: UserRole, phone?: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUser: (updated: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Quick demo profiles for testing all 3 roles effortlessly
export const DEMO_PROFILES: Record<UserRole, { id: string; email: string; name: string }> = {
  owner: { id: 'usr_owner_1', email: 'emily@example.com', name: 'Emily Watson' },
  vet: { id: 'usr_vet_1', email: 'dr.sarah@petcare.com', name: 'Dr. Sarah Jenkins' },
  admin: { id: 'usr_admin_1', email: 'admin@petcare.com', name: 'Admin Mark Foster' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('petcare_token') || 'usr_owner_1');
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize and load user profile
  useEffect(() => {
    async function loadUser() {
      try {
        const { user } = await api.getMe();
        setCurrentUser(user);
      } catch (err) {
        console.warn('Using default demo profile', err);
        // Fallback default
        setCurrentUser({
          id: 'usr_owner_1',
          name: 'Emily Watson',
          email: 'emily@example.com',
          role: 'owner',
          phone: '+1 (555) 234-5678',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
          createdAt: '2026-01-15T09:00:00Z',
        });
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password?: string) => {
    const res = await api.login(email, password);
    localStorage.setItem('petcare_token', res.token);
    setToken(res.token);
    setCurrentUser(res.user);
  };

  const register = async (name: string, email: string, role: UserRole = 'owner', phone?: string) => {
    const res = await api.register({ name, email, role, phone });
    localStorage.setItem('petcare_token', res.token);
    setToken(res.token);
    setCurrentUser(res.user);
  };

  const logout = () => {
    // Reset to default owner demo profile
    switchRole('owner');
  };

  const switchRole = (newRole: UserRole) => {
    const profile = DEMO_PROFILES[newRole];
    localStorage.setItem('petcare_token', profile.id);
    setToken(profile.id);
    // Reload user
    api.getMe().then(({ user }) => setCurrentUser(user));
  };

  const updateUser = async (updated: Partial<User>) => {
    const res = await api.updateProfile(updated);
    setCurrentUser(res.user);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'owner',
        token,
        loading,
        login,
        register,
        logout,
        switchRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
