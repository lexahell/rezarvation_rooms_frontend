import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Типизация
interface User {
  id: number;
  email: string;
  first_name: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

// Компонент провайдера
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const login = async (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);

    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      setUser(response.data);
    } catch (err) {
      console.error('Ошибка получения данных пользователя:', err);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Получение информации о пользователе
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (err) {
          console.error('Ошибка авто-логина:', err);
          logout();
        }
      };
      fetchUser();
    }
  }, [token]);

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
