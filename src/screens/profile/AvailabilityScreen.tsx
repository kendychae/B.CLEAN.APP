import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Button, Chip, FAB, ActivityIndicator } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import {
  collection, query, where, onSnapshot, addDoc, deleteDoc, doc, Timestamp,
} from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@contexts/AuthContext';
import { Availability } from '@appTypes/index';

export default function AvailabilityScreen() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'availability'), where('userId', '==', user.id));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data: Availability[] = [];
      snap.forEach((d) => {
        const raw = d.data();
        data.push({
          id: d.id,
          ...raw,
          date: raw.date instanceof Timestamp ? raw.date.toDate() : new Date(raw.date),
        } as Availability);
      });
      setAvailability(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const markedDates = availability.reduce<Record<string, any>>((acc, a) => {
    const key = a.date.toISOString().split('T')[0];
    acc[key] = {
      marked: true,
      dotColor: '#FF3B30',
      selected: key === selectedDate,
      selectedColor: key === selectedDate ? '#FF3B30' : undefined,
    };
    return acc;
  }, {
    ...(selectedDate && !availability.find((a) => a.date.toISOString().split('T')[0] === selectedDate)
      ? { [selectedDate]: { selected: true, selectedColor: '#4CBB17' } }
      : {}),
  });

  const existingForSelected = availability.find(
    (a) => a.date.toISOString().split('T')[0] === selectedDate
  );

  const handleMarkOff = async () => {
    if (!selectedDate || !user) return;
    if (existingForSelected) {
      Alert.alert('Already Marked', 'This date is already marked as unavailable.');
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, 'availability'), {
        userId: user.id,
        date: Timestamp.fromDate(new Date(selectedDate + 'T12:00:00')),
        isFullDayOff: true,
        reason: 'Off',
        slots: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch {
      Alert.alert('Error', 'Could not mark availability');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveOff = async () => {
    if (!existingForSelected) return;
    Alert.alert('Remove Day Off', 'Mark yourself as available on this day?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'availability', existingForSelected.id));
          } catch {
            Alert.alert('Error', 'Could not update availability');
          }
        },
      },
    ]);
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CBB17" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
        minDate={today}
        theme={{
          selectedDayBackgroundColor: '#4CBB17',
          todayTextColor: '#4CBB17',
          arrowColor: '#4CBB17',
          dotColor: '#FF3B30',
        }}
      />

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#FF3B30' }]} />
          <Text style={styles.legendText}>Unavailable / Day Off</Text>
        </View>
      </View>

      {selectedDate ? (
        <Card style={styles.actionCard}>
          <Card.Content>
            <Text style={styles.selectedDateText}>
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
              })}
            </Text>
            {existingForSelected ? (
              <>
                <Chip style={styles.offChip} textStyle={styles.offChipText}>Marked Unavailable</Chip>
                <Button
                  mode="outlined"
                  onPress={handleRemoveOff}
                  style={styles.removeBtn}
                  textColor="#34C759"
                >
                  Mark as Available
                </Button>
              </>
            ) : (
              <Button
                mode="contained"
                onPress={handleMarkOff}
                loading={saving}
                disabled={saving}
                style={styles.markOffBtn}
                buttonColor="#FF3B30"
              >
                Mark Day Off / Unavailable
              </Button>
            )}
          </Card.Content>
        </Card>
      ) : (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Tap a date to mark yourself unavailable</Text>
          <Text style={styles.hintSub}>
            When you're marked off, schedulers can't book you for that day
          </Text>
        </View>
      )}

      {/* Upcoming days off list */}
      {availability.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Upcoming Days Off</Text>
          <FlatList
            data={availability.sort((a, b) => a.date.getTime() - b.date.getTime())}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.dayOffItem}>
                <Text style={styles.dayOffDate}>
                  {item.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
                <Button
                  compact
                  mode="text"
                  textColor="#FF3B30"
                  onPress={async () => {
                    try {
                      await deleteDoc(doc(db, 'availability', item.id));
                    } catch {
                      Alert.alert('Error', 'Could not remove');
                    }
                  }}
                >
                  Remove
                </Button>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  legend: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#F5F5F5' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: '#3C3C43' },
  actionCard: { margin: 16, elevation: 1 },
  selectedDateText: { fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginBottom: 12 },
  offChip: { backgroundColor: '#FF3B30', alignSelf: 'flex-start', marginBottom: 12 },
  offChipText: { color: '#fff', fontWeight: '700' },
  removeBtn: { borderColor: '#34C759' },
  markOffBtn: { marginTop: 4 },
  hint: { padding: 24, alignItems: 'center' },
  hintText: { fontSize: 16, color: '#1C1C1E', textAlign: 'center', marginBottom: 8, fontWeight: '500' },
  hintSub: { fontSize: 13, color: '#8E8E93', textAlign: 'center', lineHeight: 18 },
  listSection: { flex: 1, paddingHorizontal: 16 },
  listTitle: { fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 },
  dayOffItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  dayOffDate: { fontSize: 15, color: '#1C1C1E' },
});
