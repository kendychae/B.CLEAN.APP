import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Text, Card, Chip, FAB, ActivityIndicator, Button } from 'react-native-paper';
import { collection, query, where, onSnapshot, Timestamp, getDocs } from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@contexts/AuthContext';
import { Job, JobStatus, UserRole, Availability } from '@appTypes/index';

export default function ScheduleScreen({ navigation }: any) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [dayJobs, setDayJobs] = useState<Job[]>([]);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [availability, setAvailability] = useState<Availability[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = user.role === UserRole.ADMIN
      ? query(collection(db, 'jobs'))
      : query(collection(db, 'jobs'), where('assignedTo', '==', user.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData: Job[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        jobsData.push({
          id: d.id,
          ...data,
          scheduledDate: data.scheduledDate instanceof Timestamp
            ? data.scheduledDate.toDate()
            : new Date(data.scheduledDate),
        } as Job);
      });
      setJobs(jobsData);

      const marked: Record<string, any> = {};
      jobsData.forEach((job) => {
        const key = job.scheduledDate.toISOString().split('T')[0];
        const color = job.status === JobStatus.COMPLETED ? '#34C759' :
          job.status === JobStatus.CANCELLED ? '#FF3B30' : '#4CBB17';
        marked[key] = {
          marked: true,
          dotColor: color,
          ...(selectedDate === key ? { selected: true, selectedColor: '#4CBB17' } : {}),
        };
      });
      setMarkedDates(marked);
      setLoading(false);

      if (selectedDate) {
        const filtered = jobsData.filter(
          (j) => j.scheduledDate.toISOString().split('T')[0] === selectedDate
        );
        setDayJobs(filtered.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)));
      }
    }, (error) => {
      console.error('Schedule snapshot error:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, selectedDate]);

  const handleDayPress = (day: { dateString: string }) => {
    const date = day.dateString;
    setSelectedDate(date);
    const filtered = jobs.filter(
      (j) => j.scheduledDate.toISOString().split('T')[0] === date
    );
    setDayJobs(filtered.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)));
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SCHEDULED: return '#4CBB17';
      case JobStatus.IN_PROGRESS: return '#FF9500';
      case JobStatus.COMPLETED: return '#34C759';
      case JobStatus.CANCELLED: return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const handleAddJob = () => {
    navigation.navigate('Jobs', {
      screen: 'AddEditJob',
      params: { selectedDate: selectedDate || undefined },
    });
  };

  const today = new Date().toISOString().split('T')[0];
  const displayMarked = {
    ...markedDates,
    ...(selectedDate ? {
      [selectedDate]: {
        ...(markedDates[selectedDate] || {}),
        selected: true,
        selectedColor: '#4CBB17',
      },
    } : {}),
  };

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
        markedDates={displayMarked}
        onDayPress={handleDayPress}
        current={today}
        theme={{
          selectedDayBackgroundColor: '#4CBB17',
          todayTextColor: '#4CBB17',
          dotColor: '#4CBB17',
          arrowColor: '#4CBB17',
          textSectionTitleColor: '#8E8E93',
          monthTextColor: '#1C1C1E',
          dayTextColor: '#1C1C1E',
        }}
      />

      {/* Availability shortcut for non-admin */}
      {user?.role !== UserRole.ADMIN && (
        <TouchableOpacity
          style={styles.availabilityBar}
          onPress={() => (navigation as any).navigate('Profile', { screen: 'Availability' })}
        >
          <Text style={styles.availabilityText}>Manage My Availability</Text>
          <Text style={styles.availabilityArrow}>›</Text>
        </TouchableOpacity>
      )}

      {/* Day View */}
      <View style={styles.dayView}>
        <Text style={styles.dayTitle}>
          {selectedDate
            ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
            : 'Select a date to view jobs'}
        </Text>

        <FlatList
          data={dayJobs}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            selectedDate ? (
              <Text style={styles.emptyText}>No jobs scheduled for this day</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <Card
              style={styles.jobCard}
              onPress={() => navigation.navigate('Jobs', { screen: 'JobDetail', params: { jobId: item.id } })}
            >
              <Card.Content>
                <View style={styles.jobRow}>
                  <View style={styles.jobLeft}>
                    <Text style={styles.jobTime}>{item.scheduledTime}</Text>
                    <Text style={styles.jobCustomer}>{item.customerName}</Text>
                    {user?.role === UserRole.ADMIN && (
                      <Text style={styles.jobTech}>{item.assignedToName}</Text>
                    )}
                  </View>
                  <View style={styles.jobRight}>
                    <Text style={styles.jobPrice}>${item.price.toFixed(2)}</Text>
                    <Chip
                      style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
                      textStyle={styles.chipText}
                      compact
                    >
                      {item.status.replace('_', ' ')}
                    </Chip>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      </View>

      {/* FAB: Admin/Salesperson can add jobs */}
      {(user?.role === UserRole.ADMIN || user?.role === UserRole.SALESPERSON) && (
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={handleAddJob}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  availabilityBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  availabilityText: { fontSize: 14, color: '#4CBB17', fontWeight: '500' },
  availabilityArrow: { fontSize: 18, color: '#8E8E93' },
  dayView: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 8 },
  dayTitle: { fontSize: 15, fontWeight: '600', color: '#1C1C1E', paddingHorizontal: 16, paddingBottom: 8 },
  emptyText: { color: '#8E8E93', textAlign: 'center', padding: 24, fontStyle: 'italic' },
  jobCard: { marginHorizontal: 16, marginBottom: 8, elevation: 1 },
  jobRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobLeft: { flex: 1 },
  jobRight: { alignItems: 'flex-end', gap: 4 },
  jobTime: { fontSize: 14, fontWeight: '700', color: '#4CBB17' },
  jobCustomer: { fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginTop: 2 },
  jobTech: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  jobPrice: { fontSize: 15, fontWeight: '700', color: '#34C759' },
  statusChip: { height: 22 },
  chipText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#4CBB17' },
});

