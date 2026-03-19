import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNavigationContainerRef } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { NeonLink } from './src/components/NeonLink';
import { AppProvider } from './src/context/AppContext';
import { COLORS } from './src/constants/theme';
import * as SystemUI from 'expo-system-ui';

export const navigationRef = createNavigationContainerRef();

export default function App() {
  const [neonLinkExpanded, setNeonLinkExpanded] = useState(false);

  useEffect(() => {
    // Set system UI theme to dark
    SystemUI.setBackgroundColorAsync(COLORS.MATTE_BLACK);
  }, []);

  const handleUrlDetected = ({ url, type, size }) => {
    console.log('URL Detected:', { url, type, size });

    if (navigationRef.isReady()) {
      navigationRef.navigate('Downloader', {
        initialUrl: url,
        detectedType: type,
        detectedSize: size,
      });
    }
  };

  return (
    <AppProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.MATTE_BLACK}
          translucent={false}
        />
        
        {/* Navigation Stack */}
        <RootNavigator navigationRef={navigationRef} />

        {/* Neon Link Floating Widget */}
        <NeonLink
          onDetectUrl={handleUrlDetected}
          onExpandedChange={setNeonLinkExpanded}
        />
      </GestureHandlerRootView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MATTE_BLACK,
  },
});
