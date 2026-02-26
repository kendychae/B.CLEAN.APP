import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';

import { AuthProvider } from '@contexts/AuthContext';
import { AppProvider } from '@contexts/AppContext';
import Navigation from '@navigation/Navigation';
import ErrorBoundary from '@components/ErrorBoundary';
import { initializeFirebase } from '@config/firebase';
import { setupNotifications } from '@services/notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize Firebase
        await initializeFirebase();
        
        // Setup push notifications
        await setupNotifications();
        
        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsReady(true); // Still allow app to load
      }
    };

    initialize();
  }, []);

  if (!isReady) {
    return null; // Or a splash screen component
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <AuthProvider>
              <AppProvider>
                <Navigation />
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
              </AppProvider>
            </AuthProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
