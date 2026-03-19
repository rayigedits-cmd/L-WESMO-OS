import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { AboutScreen, SettingsScreen } from '../screens/SettingsScreen';
import { DownloaderScreen } from '../screens/DownloaderScreen';
import { FilesScreen } from '../screens/FilesScreen';
import { ScannerScreen } from '../screens/ScannerScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = ({ navigationRef }) => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
          cardStyle: { backgroundColor: '#0A0E27' },
        }}
      >
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ animationEnabled: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Downloader" component={DownloaderScreen} />
        <Stack.Screen name="Files" component={FilesScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
