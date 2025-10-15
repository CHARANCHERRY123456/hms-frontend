'use client';
import { signIn, signOut } from 'next-auth/react';
import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const login = () => signIn('google');
  const logout = () => signOut({ callbackUrl: '/' });

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
