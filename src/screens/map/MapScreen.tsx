import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FAB } from 'react-native-paper';
import * as Location from 'expo-location';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@config/firebase';
import { MapPin, PinType } from '@types/index';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [pins, setPins] = useState<MapPin[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'mapPins'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pinsData: MapPin[] = [];
      snapshot.forEach((doc) => {
        pinsData.push({ id: doc.id, ...doc.data() } as MapPin);
      });
      setPins(pinsData);
    });

    return unsubscribe;
  }, []);

  const getPinColor = (type: PinType) => {
    switch (type) {
      case PinType.CUSTOMER:
        return '#4CAF50'; // Green
      case PinType.LEAD:
        return '#FFC107'; // Yellow
      case PinType.DNC:
        return '#F44336'; // Red
      default:
        return '#2196F3'; // Blue
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: location?.coords.latitude || 37.78825,
          longitude: location?.coords.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.coordinates.latitude,
              longitude: pin.coordinates.longitude,
            }}
            title={pin.name}
            description={pin.address}
            pinColor={getPinColor(pin.type)}
          />
        ))}
      </MapView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          // Open add pin modal
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
});
