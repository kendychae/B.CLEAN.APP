import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isOffline: boolean;
  setIsOffline: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    isOffline,
    setIsOffline,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
