import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';

export const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    throw error;
  }
};

export const geocodeAddress = async (address: string) => {
  try {
    const result = await Location.geocodeAsync(address);
    if (result.length > 0) {
      return {
        latitude: result[0].latitude,
        longitude: result[0].longitude,
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};

export const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const result = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (result.length > 0) {
      const location = result[0];
      return {
        street: location.street || '',
        city: location.city || '',
        state: location.region || '',
        zipCode: location.postalCode || '',
        country: location.country || '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
};

export const openMapsNavigation = async (latitude: number, longitude: number, label?: string) => {
  const destination = `${latitude},${longitude}`;
  const encodedLabel = label ? encodeURIComponent(label) : '';

  try {
    if (Platform.OS === 'ios') {
      // Use Apple Maps on iOS
      const url = `maps://app?daddr=${destination}&q=${encodedLabel}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback to Google Maps web
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
        await Linking.openURL(webUrl);
      }
    } else {
      // Use Google Maps on Android
      const url = `google.navigation:q=${destination}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback to Google Maps web
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
        await Linking.openURL(webUrl);
      }
    }
  } catch (error) {
    console.error('Error opening maps navigation:', error);
    throw error;
  }
};
