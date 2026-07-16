import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CrimeLocationContext = createContext(null);

const STORAGE_KEY = 'crimealert-user-location';

export function CrimeLocationProvider({ children }) {
  const [location, setLocation] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (!location) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    } catch {
      // ignore
    }
  }, [location]);

  const value = useMemo(() => ({ location, setLocation }), [location]);

  return (
    <CrimeLocationContext.Provider value={value}>
      {children}
    </CrimeLocationContext.Provider>
  );
}

export function useCrimeLocation() {
  const ctx = useContext(CrimeLocationContext);
  if (!ctx) throw new Error('useCrimeLocation must be used within CrimeLocationProvider');
  return ctx;
}

