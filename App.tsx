import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
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
  const [initError, setInitError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  useEffect(() => {
    const initialize = async () => {
      console.log('Starting app initialization...');
      try {
        // Initialize Firebase
        console.log('Initializing Firebase...');
        await initializeFirebase();
        console.log('Firebase initialized!');
        
        // Setup push notifications (skip on web)
        console.log('Setting up notifications...');
        await setupNotifications();
        console.log('Notifications setup complete!');
        
        setIsReady(true);
        console.log('App ready!');
      } catch (error) {
        console.error('App initialization error:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown error');
        setIsReady(true); // Still allow app to load
      }
    };

    initialize();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading B.CLEAN...</Text>
        {initError && <Text style={styles.errorText}>Error: {initError}</Text>}
      </View>
    );
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#333',
  },
  errorText: {
    marginTop: 16,
    fontSize: 14,
    color: '#FF3B30',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});
