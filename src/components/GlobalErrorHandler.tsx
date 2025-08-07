'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ApiError } from '@/types';

interface GlobalErrorContextType {
  showError: (error: ApiError) => void;
  clearError: () => void;
  currentError: ApiError | null;
}

const GlobalErrorContext = createContext<GlobalErrorContextType | undefined>(undefined);

export const useGlobalError = () => {
  const context = useContext(GlobalErrorContext);
  if (!context) {
    return {
      showError: (error: ApiError) => {},
      clearError: () => {},
      currentError: null,
    };
  }
  return context;
};

interface GlobalErrorProviderProps {
  children: ReactNode;
}

export const GlobalErrorProvider: React.FC<GlobalErrorProviderProps> = ({ children }) => {
  const [currentError, setCurrentError] = useState<ApiError | null>(null);

  const showError = (error: ApiError) => {
    if (!error || typeof error !== 'object' || !error.message) {
      return;
    }
    setCurrentError(error);
  };

  const clearError = () => {
    setCurrentError(null);
  };

  return (
    <GlobalErrorContext.Provider value={{ showError, clearError, currentError }}>
      {children}
    </GlobalErrorContext.Provider>
  );
};
