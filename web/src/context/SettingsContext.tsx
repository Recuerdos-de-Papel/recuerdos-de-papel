import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSettings } from '../services/settingsService';
import type { Setting } from '../types';

interface SettingsContextType {
  settings: Record<string, string>;
  loading: boolean;
  getSetting: (key: string) => string | null;
  logo: string | null;
  banner: string | null;
  whatsapp: string | null;
  businessName: string | null;
  businessEmail: string | null;
  businessPhone: string | null;
  businessAddress: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  tiktok: string | null;
  youtube: string | null;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settings: Setting[] = await getSettings();
      const map: Record<string, string> = {};
      settings.forEach((s) => {
        map[s.key] = s.value;
      });
      setSettingsMap(map);
    } catch (error) {
      // Error handled silently - settings will be empty, components will use fallbacks
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const getSetting = (key: string): string | null => {
    return settingsMap[key] || null;
  };

  // Helper: logo - checks 'logo' key
  const logo = getSetting('logo');

  // Helper: banner - checks 'banner' key
  const banner = getSetting('banner');

  // Helper: whatsapp - checks 'whatsapp' key
  const whatsapp = getSetting('whatsapp');

  // Helper: business name - checks 'business_name' then 'name'
  const businessName = getSetting('business_name') || getSetting('name');

  // Helper: business email - checks 'business_email' then 'email'
  const businessEmail = getSetting('business_email') || getSetting('email');

  // Helper: business phone - checks 'business_phone' then 'phone'
  const businessPhone = getSetting('business_phone') || getSetting('phone');

  // Helper: business address - checks 'business_address' then 'address'
  const businessAddress = getSetting('business_address') || getSetting('address');

  // Helper: social links
  const facebook = getSetting('facebook');
  const instagram = getSetting('instagram');
  const twitter = getSetting('twitter');
  const tiktok = getSetting('tiktok');
  const youtube = getSetting('youtube');

  return (
    <SettingsContext.Provider
      value={{
        settings: settingsMap,
        loading,
        getSetting,
        logo,
        banner,
        whatsapp,
        businessName,
        businessEmail,
        businessPhone,
        businessAddress,
        facebook,
        instagram,
        twitter,
        tiktok,
        youtube,
        refreshSettings: loadSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
