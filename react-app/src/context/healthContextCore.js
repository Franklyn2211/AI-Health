import { createContext, useContext } from 'react';

export const HealthContext = createContext();

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) throw new Error('useHealth must be used within HealthProvider');
  return context;
}
