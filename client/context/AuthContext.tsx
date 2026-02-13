'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'manager' | 'waiter' | 'chef';
  restaurantId?: number;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth on mount
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setUser(parsed);
      } catch (error) {
        localStorage.removeItem('auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting login for:', username);
      
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        console.error('Login failed:', errorData);
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      const userData: User = {
        id: data.id,
        username: data.username,
        role: data.role,
        restaurantId: data.restaurantId,
        token: data.token,
      };

      setUser(userData);
      localStorage.setItem('auth', JSON.stringify(userData));

      // Redirect based on role
      if (data.role === 'admin') {
        router.push('/admin');
      } else if (data.role === 'manager') {
        router.push('/manager');
      } else if (data.role === 'waiter') {
        router.push('/waiter');
      } else if (data.role === 'chef') {
        router.push('/chef');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
