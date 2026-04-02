import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Platform, Modal, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, LongPressEvent } from 'react-native-maps';
import { FAB, Text, TextInput, Button, Card, SegmentedButtons } from 'react-native-paper';
import * as Location from 'expo-location';
import {
  collection, onSnapshot, query, addDoc, updateDoc, doc, Timestamp,
} from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@contexts/AuthContext';
import { MapPin, PinType, UserRole } from '@appTypes/index';
import { getCurrentLocation } from '@services/location';

export default function MapScreen({ navigation }: any) {
  const { user } = useAuth();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [pins, setPins] = useState<MapPin[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailPin, setDetailPin] = useState<MapPin | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [newPinCoords, setNewPinCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pinType, setPinType] = useState<PinType>(PinType.LEAD);
  const [pinName, setPinName] = useState('');
  const [pinPhone, setPinPhone] = useState('');
  const [pinAddress, setPinAddress] = useState('');
  const [pinNotes, setPinNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      try {
        const coords = await getCurrentLocation();
        setLocation({ coords: { ...coords, altitude: 0, accuracy: 5, altitudeAccuracy: 5, heading: 0, speed: 0 }, timestamp: Date.now() } as any);
      } catch {
        // use default region
      }
    })();

    const q = query(collection(db, 'mapPins'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pinsData: MapPin[] = [];
      snapshot.forEach((d) => pinsData.push({ id: d.id, ...d.data() } as MapPin));
      setPins(pinsData);
    });

    return unsubscribe;
  }, []);

  const getPinColor = (type: PinType) => {
    switch (type) {
      case PinType.CUSTOMER: return '#34C759';
      case PinType.LEAD: return '#FF9500';
      case PinType.DNC: return '#FF3B30';
      default: return '#007AFF';
    }
  };

  const handleLongPress = (e: LongPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setNewPinCoords({ latitude, longitude });
    setPinType(PinType.LEAD);
    setPinName('');
    setPinPhone('');
    setPinAddress('');
    setPinNotes('');
    setModalVisible(true);
  };

  const handleSavePin = async () => {
    if (!newPinCoords) return;
    if (!pinAddress.trim()) {
      Alert.alert('Required', 'Please enter an address');
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, 'mapPins'), {
        type: pinType,
        coordinates: newPinCoords,
        address: pinAddress.trim(),
        name: pinName.trim() || null,
        phone: pinPhone.trim() || null,
        notes: pinNotes.trim() || null,
        createdBy: user?.id || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      setModalVisible(false);
    } catch {
      Alert.alert('Error', 'Could not save pin');
    } finally {
      setSaving(false);
    }
  };

  const handlePinPress = (pin: MapPin) => {
    setDetailPin(pin);
    setDetailVisible(true);
  };

  const handleMarkDNC = async () => {
    if (!detailPin) return;
    try {
      await updateDoc(doc(db, 'mapPins', detailPin.id), {
        type: PinType.DNC,
        updatedAt: Timestamp.now(),
      });
      setDetailVisible(false);
      Alert.alert('Marked DNC', 'This address is now marked as Do Not Contact for the entire team.');
    } catch {
      Alert.alert('Error', 'Could not update pin');
    }
  };

  const handleConvertToCustomer = () => {
    setDetailVisible(false);
    (navigation as any).navigate('Customers', {
      screen: 'AddEditCustomer',
      params: {},
    });
  };

  const handleAddPin = async () => {
    try {
      const coords = await getCurrentLocation();
      setNewPinCoords(coords);
      setPinType(PinType.LEAD);
      setPinName('');
      setPinPhone('');
      setPinAddress('');
      setPinNotes('');
      setModalVisible(true);
    } catch {
      Alert.alert('Location Error', 'Could not get your current location. Long-press on the map to drop a pin.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: location?.coords.latitude || 37.78825,
          longitude: location?.coords.longitude || -122.4324,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
        onLongPress={handleLongPress}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={pin.coordinates}
            title={pin.name || pin.type.toUpperCase()}
            description={pin.address}
            pinColor={getPinColor(pin.type)}
            onPress={() => handlePinPress(pin)}
          />
        ))}
      </MapView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#34C759' }]} />
          <Text style={styles.legendText}>Customer</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#FF9500' }]} />
          <Text style={styles.legendText}>Lead</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#FF3B30' }]} />
          <Text style={styles.legendText}>DNC</Text>
        </View>
      </View>

      <FAB
        style={styles.fab}
        icon="map-marker-plus"
        onPress={handleAddPin}
        label="Add Pin"
      />

      {/* Add Pin Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Map Pin</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.fieldLabel}>Pin Type</Text>
            <SegmentedButtons
              value={pinType}
              onValueChange={(v) => setPinType(v as PinType)}
              buttons={[
                { value: PinType.LEAD, label: 'Lead' },
                { value: PinType.DNC, label: 'Do Not Contact' },
                { value: PinType.CUSTOMER, label: 'Customer' },
              ]}
              style={styles.segmented}
            />

            <TextInput
              label="Address *"
              value={pinAddress}
              onChangeText={setPinAddress}
              mode="outlined"
              style={styles.modalInput}
            />
            <TextInput
              label="Name (optional)"
              value={pinName}
              onChangeText={setPinName}
              mode="outlined"
              style={styles.modalInput}
            />
            <TextInput
              label="Phone (optional)"
              value={pinPhone}
              onChangeText={setPinPhone}
              keyboardType="phone-pad"
              mode="outlined"
              style={styles.modalInput}
            />
            <TextInput
              label="Notes (optional)"
              value={pinNotes}
              onChangeText={setPinNotes}
              multiline
              numberOfLines={2}
              mode="outlined"
              style={styles.modalInput}
            />

            <Button
              mode="contained"
              onPress={handleSavePin}
              loading={saving}
              disabled={saving}
              style={styles.saveBtn}
            >
              Save Pin
            </Button>
          </View>
        </View>
      </Modal>

      {/* Pin Detail Modal */}
      <Modal visible={detailVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDetailVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{detailPin?.name || detailPin?.type?.toUpperCase()}</Text>
            <TouchableOpacity onPress={() => setDetailVisible(false)}>
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.detailAddress}>{detailPin?.address}</Text>
            {detailPin?.phone && <Text style={styles.detailInfo}>Phone: {detailPin.phone}</Text>}
            {detailPin?.notes && <Text style={styles.detailInfo}>Notes: {detailPin.notes}</Text>}

            {detailPin?.type === PinType.LEAD && (
              <>
                <Button
                  mode="contained"
                  icon="account-plus"
                  onPress={handleConvertToCustomer}
                  style={[styles.actionBtn, { backgroundColor: '#34C759' }]}
                >
                  Convert to Customer
                </Button>
                <Button
                  mode="outlined"
                  icon="hand-back-right-off"
                  onPress={handleMarkDNC}
                  style={[styles.actionBtn, { borderColor: '#FF3B30' }]}
                  textColor="#FF3B30"
                >
                  Mark Do Not Contact
                </Button>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  legend: {
    position: 'absolute', top: 16, left: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 10, padding: 10, gap: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 3,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12, color: '#1C1C1E', fontWeight: '500' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#007AFF' },
  modalContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E5EA',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  cancelText: { fontSize: 16, color: '#007AFF' },
  modalContent: { padding: 16 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 },
  segmented: { marginBottom: 16 },
  modalInput: { marginBottom: 12 },
  saveBtn: { backgroundColor: '#007AFF', marginTop: 8 },
  detailAddress: { fontSize: 16, color: '#1C1C1E', marginBottom: 8, lineHeight: 22 },
  detailInfo: { fontSize: 14, color: '#3C3C43', marginBottom: 4 },
  actionBtn: { marginBottom: 12 },
});

