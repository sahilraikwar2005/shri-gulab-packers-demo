import React, { createContext, useContext } from 'react';
import { useApiQuery } from '../api/useApiQuery';

const SiteContext = createContext({ settings: null, loading: true });

export function SiteProvider({ children }) {
  const query = useApiQuery(['site-settings'], '/api/v1/settings');

  return (
    <SiteContext.Provider
      value={{
        settings: query.data || null,
        loading: query.isPending,
        error: query.error,
        retry: query.refetch,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}