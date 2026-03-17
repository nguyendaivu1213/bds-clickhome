"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchSiteSettings, type SiteSettings } from '@/lib/api';

interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: {},
  loading: true,
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
