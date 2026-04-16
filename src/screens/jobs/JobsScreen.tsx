import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Chip, ActivityIndicator, FAB, SegmentedButtons } from 'react-native-paper';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@contexts/AuthContext';
import { Job, JobStatus, UserRole } from '@appTypes/index';
import AdBanner from '@components/AdBanner';

const STATUS_FILTERS = ['all', JobStatus.SCHEDULED, JobStatus.IN_PROGRESS, JobStatus.COMPLETED];

export default function JobsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const isAdmin = user.role === UserRole.ADMIN;
    const q = isAdmin
      ? query(collection(db, 'jobs'))
      : query(collection(db, 'jobs'), where('assignedTo', '==', user.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Job[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        data.push({
          id: doc.id,
          ...d,
          scheduledDate: d.scheduledDate instanceof Timestamp ? d.scheduledDate.toDate() : new Date(d.scheduledDate),
          completedAt: d.completedAt
            ? (d.completedAt instanceof Timestamp ? d.completedAt.toDate() : new Date(d.completedAt))
            : undefined,
        } as Job);
      });
      data.sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
      setJobs(data);
      setLoading(false);
    }, (error) => {
      console.error('Jobs snapshot error:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SCHEDULED:    return '#4CBB17';
      case JobStatus.IN_PROGRESS:  return '#FF9500';
      case JobStatus.COMPLETED:    return '#34C759';
      case JobStatus.CANCELLED:    return '#FF3B30';
      default:                     return '#8E8E93';
    }
  };

  const getStatusLabel = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SCHEDULED:    return 'Scheduled';
      case JobStatus.IN_PROGRESS:  return 'In Progress';
      case JobStatus.COMPLETED:    return 'Completed';
      case JobStatus.CANCELLED:    return 'Cancelled';
      default:                     return status;
    }
  };

  const filteredJobs = statusFilter === 'all' ? jobs : jobs.filter((j) => j.status === statusFilter);

  const canAddJob = user?.role === UserRole.ADMIN || user?.role === UserRole.SALESPERSON;

  const renderJob = ({ item }: { item: Job }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.chipText}
            compact
          >
            {getStatusLabel(item.status)}
          </Chip>
        </View>
        <Text style={styles.date}>{item.scheduledDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
        <Text style={styles.time}>{item.scheduledTime} · {item.duration} min</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        {user?.role === UserRole.ADMIN && item.assignedToName && (
          <Text style={styles.assignee}>Assigned: {item.assignedToName}</Text>
        )}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CBB17" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={statusFilter}
        onValueChange={setStatusFilter}
        style={styles.filters}
        buttons={[
          { value: 'all', label: 'All', style: styles.filterBtn },
          { value: JobStatus.SCHEDULED, label: 'Scheduled', style: styles.filterBtn },
          { value: JobStatus.IN_PROGRESS, label: 'Active', style: styles.filterBtn },
          { value: JobStatus.COMPLETED, label: 'Done', style: styles.filterBtn },
        ]}
      />

      <FlatList
        data={filteredJobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListFooterComponent={<AdBanner style={{ marginTop: 12, marginBottom: 16 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No jobs found</Text>
          </View>
        }
      />

      {canAddJob && (
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('AddEditJob', {})}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filters: { margin: 12 },
  filterBtn: { flex: 1 },
  list: { padding: 12, paddingTop: 0, paddingBottom: 80 },
  card: { marginBottom: 10, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  customerName: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', flex: 1, marginRight: 8 },
  statusChip: { height: 22 },
  chipText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  date: { fontSize: 14, color: '#3C3C43', marginBottom: 2 },
  time: { fontSize: 13, color: '#8E8E93' },
  price: { fontSize: 16, fontWeight: '700', color: '#34C759', marginTop: 4 },
  assignee: { fontSize: 13, color: '#4CBB17', marginTop: 2 },
  empty: { flex: 1, alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#8E8E93', fontSize: 16 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#4CBB17' },
});
