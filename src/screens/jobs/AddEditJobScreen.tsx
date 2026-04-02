import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, StyleSheet, Alert, Platform,
} from 'react-native';
import {
  Text, TextInput, Button, Card, ActivityIndicator, Menu,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  collection, getDocs, getDoc, doc, addDoc, updateDoc, query, where, Timestamp,
} from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@contexts/AuthContext';
import { Customer, Job, JobStatus, PaymentStatus, User, UserRole } from '@appTypes/index';
import { StackScreenProps } from '@react-navigation/stack';
import { JobsStackParamList } from '@navigation/types';
import { scheduleJobReminder } from '@services/notifications';

type Props = StackScreenProps<JobsStackParamList, 'AddEditJob'>;

export default function AddEditJobScreen({ route, navigation }: Props) {
  const { jobId, customerId: prefilledCustomerId, selectedDate } = route.params || {};
  const { user } = useAuth();
  const isEdit = !!jobId;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date>(
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [scheduledTime, setScheduledTime] = useState('09:00 AM');
  const [timeDate, setTimeDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [duration, setDuration] = useState('90');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [customerMenuVisible, setCustomerMenuVisible] = useState(false);
  const [employeeMenuVisible, setEmployeeMenuVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customerSnap, employeeSnap] = await Promise.all([
        getDocs(query(collection(db, 'customers'), where('status', '==', 'active'))),
        getDocs(collection(db, 'users')),
      ]);

      const customerList: Customer[] = [];
      customerSnap.forEach((d) => customerList.push({ id: d.id, ...d.data() } as Customer));
      setCustomers(customerList);

      const employeeList: User[] = [];
      employeeSnap.forEach((d) => employeeList.push({ id: d.id, ...d.data() } as User));
      setEmployees(employeeList);

      // Prefill customer if provided
      if (prefilledCustomerId) {
        const found = customerList.find((c) => c.id === prefilledCustomerId);
        if (found) setSelectedCustomer(found);
      }

      // For non-admin, pre-select self
      if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SALESPERSON) {
        const self = employeeList.find((e) => e.id === user?.id);
        if (self) setSelectedEmployee(self);
      }

      // Load job data if editing
      if (isEdit && jobId) {
        const jobSnap = await getDoc(doc(db, 'jobs', jobId));
        if (jobSnap.exists()) {
          const data = jobSnap.data() as Job;
          const scheduledAt = data.scheduledDate instanceof Timestamp
            ? data.scheduledDate.toDate()
            : new Date(data.scheduledDate);
          setScheduledDate(scheduledAt);
          setScheduledTime(data.scheduledTime);
          const [hourStr, rest] = data.scheduledTime.split(':');
          const [minStr, period] = rest.split(' ');
          let hours = parseInt(hourStr, 10);
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          const td = new Date();
          td.setHours(hours, parseInt(minStr, 10), 0, 0);
          setTimeDate(td);
          setDuration(String(data.duration));
          setPrice(String(data.price));
          setNotes(data.notes || '');
          const customer = customerList.find((c) => c.id === data.customerId);
          if (customer) setSelectedCustomer(customer);
          const employee = employeeList.find((e) => e.id === data.assignedTo);
          if (employee) setSelectedEmployee(employee);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Could not load data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const handleSave = async () => {
    if (!selectedCustomer) {
      Alert.alert('Required', 'Please select a customer');
      return;
    }
    if (!selectedEmployee) {
      Alert.alert('Required', 'Please select an employee to assign');
      return;
    }
    if (!price || isNaN(parseFloat(price))) {
      Alert.alert('Required', 'Please enter a valid price');
      return;
    }

    setSaving(true);
    try {
      const jobData = {
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        assignedTo: selectedEmployee.id,
        assignedToName: selectedEmployee.displayName,
        scheduledDate: Timestamp.fromDate(scheduledDate),
        scheduledTime,
        duration: parseInt(duration, 10) || 90,
        status: JobStatus.SCHEDULED,
        price: parseFloat(price),
        paymentStatus: PaymentStatus.UNPAID,
        notes,
        updatedAt: Timestamp.now(),
      };

      if (isEdit && jobId) {
        await updateDoc(doc(db, 'jobs', jobId), jobData);
      } else {
        const newJob = await addDoc(collection(db, 'jobs'), {
          ...jobData,
          beforePhotos: [],
          afterPhotos: [],
          createdBy: user?.id || '',
          createdAt: Timestamp.now(),
        });
        // Schedule push reminder
        await scheduleJobReminder(newJob.id, scheduledDate);
      }

      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save job');
    } finally {
      setSaving(false);
    }
  };

  const canAssignAny = user?.role === UserRole.ADMIN || user?.role === UserRole.SALESPERSON;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

      {/* Customer Selection */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Customer *</Text>
          <Menu
            visible={customerMenuVisible}
            onDismiss={() => setCustomerMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setCustomerMenuVisible(true)}
                style={styles.menuButton}
                contentStyle={styles.menuButtonContent}
                icon="chevron-down"
              >
                {selectedCustomer ? selectedCustomer.name : 'Select Customer'}
              </Button>
            }
          >
            {customers.map((c) => (
              <Menu.Item
                key={c.id}
                title={`${c.name} — ${c.address.city}`}
                onPress={() => {
                  setSelectedCustomer(c);
                  setCustomerMenuVisible(false);
                  if (!price && c.totalRevenue > 0) {
                    // suggest average price
                  }
                }}
              />
            ))}
          </Menu>
          {selectedCustomer && (
            <Text style={styles.subtext}>
              {selectedCustomer.address.street}, {selectedCustomer.address.city}
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Employee Assignment */}
      {canAssignAny && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Assign To *</Text>
            <Menu
              visible={employeeMenuVisible}
              onDismiss={() => setEmployeeMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setEmployeeMenuVisible(true)}
                  style={styles.menuButton}
                  contentStyle={styles.menuButtonContent}
                  icon="chevron-down"
                >
                  {selectedEmployee ? selectedEmployee.displayName : 'Select Employee'}
                </Button>
              }
            >
              {employees.map((e) => (
                <Menu.Item
                  key={e.id}
                  title={`${e.displayName} (${e.role})`}
                  onPress={() => {
                    setSelectedEmployee(e);
                    setEmployeeMenuVisible(false);
                  }}
                />
              ))}
            </Menu>
          </Card.Content>
        </Card>
      )}

      {/* Date & Time */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Date & Time *</Text>
          <View style={styles.dateRow}>
            <Button
              mode="outlined"
              icon="calendar"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              {scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Button>
            <Button
              mode="outlined"
              icon="clock"
              onPress={() => setShowTimePicker(true)}
              style={styles.dateButton}
            >
              {scheduledTime}
            </Button>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={scheduledDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={new Date()}
              onChange={(_, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) setScheduledDate(date);
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={timeDate}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (date) {
                  setTimeDate(date);
                  setScheduledTime(formatTime(date));
                }
              }}
            />
          )}
        </Card.Content>
      </Card>

      {/* Job Details */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Job Details</Text>
          <TextInput
            label="Price ($)"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Duration (minutes)"
            value={duration}
            onChangeText={setDuration}
            keyboardType="number-pad"
            mode="outlined"
            style={styles.input}
          />
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
        {isEdit ? 'Update Job' : 'Schedule Job'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginBottom: 12, elevation: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 },
  subtext: { fontSize: 13, color: '#8E8E93', marginTop: 6 },
  menuButton: { borderColor: '#C7C7CC', justifyContent: 'flex-start' },
  menuButtonContent: { flexDirection: 'row-reverse' },
  dateRow: { flexDirection: 'row', gap: 8 },
  dateButton: { flex: 1, borderColor: '#C7C7CC' },
  input: { marginBottom: 12 },
  saveButton: { backgroundColor: '#007AFF', marginTop: 8 },
  saveButtonContent: { paddingVertical: 6 },
});
