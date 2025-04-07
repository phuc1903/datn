'use client';

import React, { createContext, useContext } from 'react';

interface Setting {
  id: number;
  name: string;
  value: string;
  created_at: string;
  updated_at: string;
}

interface SettingsContextType {
  settings: Setting[];
  getSetting: (name: string) => Setting | undefined;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ 
  children, 
  settings 
}: { 
  children: React.ReactNode;
  settings: Setting[];
}) {
  const getSetting = (name: string) => {
    return settings.find(setting => setting.name === name);
  };

  return (
    <SettingsContext.Provider value={{ settings, getSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 