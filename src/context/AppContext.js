import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [neonLinkMode, setNeonLinkMode] = useState('triangle');
  const [userPreferences, setUserPreferences] = useState({
    language: 'en',
    theme: 'dark',
    hapticFeedback: true,
    clipboardMonitoring: true,
  });

  // Load persisted data
  useEffect(() => {
    const loadData = async () => {
      try {
        const consent = await AsyncStorage.getItem('privacyConsent');
        const mode = await AsyncStorage.getItem('neonLinkMode');
        const prefs = await AsyncStorage.getItem('userPreferences');

        if (consent) setPrivacyConsent(JSON.parse(consent));
        if (mode) setNeonLinkMode(mode);
        if (prefs) setUserPreferences(JSON.parse(prefs));
      } catch (error) {
        console.log('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Save privacy consent
  const updatePrivacyConsent = async (value) => {
    try {
      await AsyncStorage.setItem('privacyConsent', JSON.stringify(value));
      setPrivacyConsent(value);
    } catch (error) {
      console.log('Error saving consent:', error);
    }
  };

  // Save neon link mode
  const updateNeonLinkMode = async (mode) => {
    try {
      await AsyncStorage.setItem('neonLinkMode', mode);
      setNeonLinkMode(mode);
    } catch (error) {
      console.log('Error saving mode:', error);
    }
  };

  // Save user preferences
  const updateUserPreferences = async (newPrefs) => {
    try {
      const updated = { ...userPreferences, ...newPrefs };
      await AsyncStorage.setItem('userPreferences', JSON.stringify(updated));
      setUserPreferences(updated);
    } catch (error) {
      console.log('Error saving preferences:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        privacyConsent,
        updatePrivacyConsent,
        neonLinkMode,
        updateNeonLinkMode,
        userPreferences,
        updateUserPreferences,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
