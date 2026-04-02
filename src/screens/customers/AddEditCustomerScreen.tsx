import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Card, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import {
  doc, getDoc, addDoc, updateDoc, collection, Timestamp,
} from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@contexts/AuthContext';
import { Customer } from '@appTypes/index';
import { geocodeAddress } from '@services/location';
import { StackScreenProps } from '@react-navigation/stack';
import { CustomersStackParamList } from '@navigation/types';

type Props = StackScreenProps<CustomersStackParamList, 'AddEditCustomer'>;

export default function AddEditCustomerScreen({ route, navigation }: Props) {
  const { customerId } = route.params || {};
  const { user } = useAuth();
  const isEdit = !!customerId;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'dnc'>('active');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && customerId) {
      loadCustomer();
    }
  }, [customerId]);

  const loadCustomer = async () => {
    try {
      const snap = await getDoc(doc(db, 'customers', customerId!));
      if (snap.exists()) {
        const data = snap.data() as Customer;
        setName(data.name);
        setPhone(data.phone);
        setEmail(data.email || '');
        setStreet(data.address.street);
        setCity(data.address.city);
        setState(data.address.state);
        setZipCode(data.address.zipCode);
        setStatus(data.status);
        setNotes(data.notes || '');
      }
    } catch {
      Alert.alert('Error', 'Could not load customer');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter customer name');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Required', 'Please enter phone number');
      return;
    }
    if (!street || !city || !state || !zipCode) {
      Alert.alert('Required', 'Please enter full address');
      return;
    }

    setSaving(true);
    try {
      const fullAddress = `${street}, ${city}, ${state} ${zipCode}`;
      let coordinates = { latitude: 0, longitude: 0 };

      try {
        const coords = await geocodeAddress(fullAddress);
        if (coords) coordinates = coords;
      } catch {
        // GPS coordinates optional - app works without them
      }

      const customerData = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        address: { street: street.trim(), city: city.trim(), state: state.trim(), zipCode: zipCode.trim(), coordinates },
        status,
        notes: notes.trim(),
        updatedAt: Timestamp.now(),
      };

      if (isEdit && customerId) {
        await updateDoc(doc(db, 'customers', customerId), customerData);
      } else {
        await addDoc(collection(db, 'customers'), {
          ...customerData,
          totalRevenue: 0,
          createdBy: user?.id || '',
          createdAt: Timestamp.now(),
        });
      }

      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save customer');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

      {/* Personal Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Contact Info</Text>
          <TextInput
            label="Full Name *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Phone Number *"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Email (optional)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* Address */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Address</Text>
          <TextInput
            label="Street Address *"
            value={street}
            onChangeText={setStreet}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="City *"
            value={city}
            onChangeText={setCity}
            mode="outlined"
            style={styles.input}
          />
          <View style={styles.row}>
            <TextInput
              label="State *"
              value={state}
              onChangeText={setState}
              mode="outlined"
              style={[styles.input, styles.stateInput]}
              autoCapitalize="characters"
              maxLength={2}
            />
            <TextInput
              label="Zip Code *"
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="number-pad"
              mode="outlined"
              style={[styles.input, styles.zipInput]}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Status */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Status</Text>
          <SegmentedButtons
            value={status}
            onValueChange={(val) => setStatus(val as 'active' | 'inactive' | 'dnc')}
            buttons={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'dnc', label: 'Do Not Contact' },
            ]}
          />
        </Card.Content>
      </Card>

      {/* Notes */}
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            mode="outlined"
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSave}
        loading={saving}
        disabled={saving}
        style={styles.saveButton}
        contentStyle={styles.saveButtonContent}
      >
        {isEdit ? 'Update Customer' : 'Add Customer'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginBottom: 12, elevation: 1 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 10 },
  input: { marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8 },
  stateInput: { width: 80 },
  zipInput: { flex: 1 },
  saveButton: { backgroundColor: '#007AFF', marginTop: 8 },
  saveButtonContent: { paddingVertical: 6 },
});
