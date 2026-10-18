import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const session = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/auth/me');
        return response.data.user;
      } catch (error) {
        if (error.response?.status === 401) return null;
        throw error;
      }
    },
    retry: false,
  });

  const login = useCallback(async (email, password) => {
    const response = await api.post('/api/v1/auth/login', { email, password });
    queryClient.setQueryData(['auth', 'me'], response.data.user);
    return response.data;
  }, [queryClient]);
  const logout = useCallback(async () => {
    await api.post('/api/v1/auth/logout');
    queryClient.setQueryData(['auth', 'me'], null);
  }, [queryClient]);

  const value = useMemo(() => ({
    user: session.data ?? null,
    loading: session.isPending,
    error: session.error,
    login,
    logout,
    refresh: session.refetch,
  }), [login, logout, session.data, session.error, session.isPending, session.refetch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);