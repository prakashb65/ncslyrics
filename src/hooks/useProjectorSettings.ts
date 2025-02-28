import { useState, useEffect } from 'react';

export function useProjectorSettings() {
  const [settings, setSettings] = useState({
    backgroundColor: '#0F172A',
    fontSize: 40,
    fontFamily: 'Arial',
    showTitle: false,
    showBackground: true,
    isFullScreen: false,
    currentVerse: 0
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('projectorSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('projectorSettings', JSON.stringify(newSettings));
  };

  return { settings, updateSettings };
} 