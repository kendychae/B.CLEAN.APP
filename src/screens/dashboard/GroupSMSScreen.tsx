import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@config/firebase';
import { Customer } from '@appTypes/index';
import { sendGroupSMS } from '@services/communication';

type FilterType = 'all' | 'active' | 'zip';

export default function GroupSMSScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [filterType, setFilterType] = useState<FilterType>('active');
  const [zipFilter, setZipFilter] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [customers, filterType, zipFilter]);

  const loadCustomers = async () => {
    try {
      const snap = await getDocs(collection(db, 'customers'));
      const list: Customer[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Customer));
      setCustomers(list);
    } catch {
      Alert.alert('Error', 'Could not load customers');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let result = customers.filter((c) => c.status !== 'dnc');
    if (filterType === 'active') {
      result = result.filter((c) => c.status === 'active');
    } else if (filterType === 'zip') {
      const zip = zipFilter.trim();
      if (zip) {
        result = result.filter((c) => c.address.zipCode.startsWith(zip));
      }
    }
    setFiltered(result);
  };

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert('Required', 'Please enter a message');
      return;
    }
    if (filtered.length === 0) {
      Alert.alert('No Recipients', 'No customers match the current filter');
      return;
    }

    const phoneNumbers = filtered.map((c) => c.phone).filter(Boolean);

    Alert.alert(
      'Send Group SMS',
      `This will open your native text app to send a message to ${phoneNumbers.length} customer(s). Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open SMS',
          onPress: async () => {
            setSending(true);
            try {
              await sendGroupSMS(phoneNumbers, message.trim());
            } catch {
              Alert.alert('Error', 'Could not open SMS app');
            } finally {
              setSending(false);
            }
          },
        },
      ]
    );
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

      {/* Filter */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Filter Recipients</Text>
          <View style={styles.filterRow}>
            {(['all', 'active', 'zip'] as FilterType[]).map((type) => (
              <Chip
                key={type}
                selected={filterType === type}
                onPress={() => setFilterType(type)}
                style={styles.filterChip}
                selectedColor="#007AFF"
              >
                {type === 'all' ? 'All Customers' : type === 'active' ? 'Active Only' : 'By Zip Code'}
              </Chip>
            ))}
          </View>

          {filterType === 'zip' && (
            <TextInput
              label="Zip Code"
              value={zipFilter}
              onChangeText={setZipFilter}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.zipInput}
              maxLength={5}
            />
          )}

          <View style={styles.recipientCount}>
            <Text style={styles.countText}>
              {filtered.length} recipient{filtered.length !== 1 ? 's' : ''} selected
            </Text>
            {filtered.length > 0 && (
              <Text style={styles.countSub}>
                (Excludes Do Not Contact)
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Message */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Message</Text>
          <TextInput
            label="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            mode="outlined"
            style={styles.messageInput}
          />
          <Text style={styles.charCount}>{message.length} characters</Text>
        </Card.Content>
      </Card>

      {/* Preview recipients */}
      {filtered.length > 0 && filtered.length <= 10 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionLabel}>Recipients Preview</Text>
            {filtered.map((c) => (
              <Text key={c.id} style={styles.recipientItem}>
                {c.name} — {c.phone}
              </Text>
            ))}
          </Card.Content>
        </Card>
      )}

      <Button
        mode="contained"
        icon="message"
        onPress={handleSend}
        loading={sending}
        disabled={sending || filtered.length === 0 || !message.trim()}
        style={styles.sendButton}
        contentStyle={styles.sendButtonContent}
      >
        Send via SMS App ({filtered.length})
      </Button>

      <Text style={styles.disclaimer}>
        Messages send from your personal phone number — no app required for customers.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginBottom: 12, elevation: 1 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 10 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  filterChip: { borderRadius: 20 },
  zipInput: { marginBottom: 10 },
  recipientCount: { marginTop: 4 },
  countText: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  countSub: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  messageInput: { marginBottom: 4 },
  charCount: { fontSize: 12, color: '#8E8E93', textAlign: 'right' },
  recipientItem: { fontSize: 14, color: '#3C3C43', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  sendButton: { backgroundColor: '#007AFF', marginTop: 8 },
  sendButtonContent: { paddingVertical: 6 },
  disclaimer: { fontSize: 12, color: '#8E8E93', textAlign: 'center', marginTop: 12, lineHeight: 18 },
});
