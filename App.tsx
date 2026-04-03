import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// B.CLEAN brand colors
const PRIMARY_GREEN = '#4CBB17';
const SECONDARY_GREEN = '#2D5A27';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: PRIMARY_GREEN,
    secondary: SECONDARY_GREEN,
    primaryContainer: '#E8F8DC',
    secondaryContainer: '#C8E6C1',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: PRIMARY_GREEN,
    secondary: SECONDARY_GREEN,
    primaryContainer: '#2D5A27',
    secondaryContainer: '#1A3A16',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
  },
};
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
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeFirebase();
        await setupNotifications();
        setIsReady(true);
      } catch (error) {
        setInitError(error instanceof Error ? error.message : 'Unknown error');
        setIsReady(true); // Still allow app to load
      }
    };

    initialize();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CBB17" />
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
