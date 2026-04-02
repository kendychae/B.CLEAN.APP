import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, Chip, Divider, ActivityIndicator } from 'react-native-paper';
import { doc, getDoc, collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@contexts/AuthContext';
import { Customer, Job, JobStatus, UserRole } from '@appTypes/index';
import { makePhoneCall, sendSMS, sendEmail } from '@services/communication';
import { openMapsNavigation } from '@services/location';
import { StackScreenProps } from '@react-navigation/stack';
import { CustomersStackParamList } from '@navigation/types';

type Props = StackScreenProps<CustomersStackParamList, 'CustomerDetail'>;

export default function CustomerDetailScreen({ route, navigation }: Props) {
  const { customerId } = route.params;
  const { user } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomer();
    const q = query(collection(db, 'jobs'), where('customerId', '==', customerId));
    const unsubscribe = onSnapshot(q, (snap) => {
      const jobList: Job[] = [];
      snap.forEach((d) => {
        const data = d.data();
        jobList.push({
          id: d.id,
          ...data,
          scheduledDate: data.scheduledDate instanceof Timestamp
            ? data.scheduledDate.toDate()
            : new Date(data.scheduledDate),
        } as Job);
      });
      setJobs(jobList.sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime()));
    });
    return unsubscribe;
  }, [customerId]);

  const loadCustomer = async () => {
    try {
      const snap = await getDoc(doc(db, 'customers', customerId));
      if (snap.exists()) {
        setCustomer({ id: snap.id, ...snap.data() } as Customer);
      }
    } catch {
      Alert.alert('Error', 'Could not load customer');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (customer?.phone) makePhoneCall(customer.phone);
  };

  const handleSMS = () => {
    if (customer?.phone) sendSMS(customer.phone, '');
  };

  const handleEmail = () => {
    if (customer?.email) sendEmail(customer.email, 'B.CLEAN — Window Washing', '');
  };

  const handleDirections = async () => {
    if (!customer) return;
    const { latitude, longitude } = customer.address.coordinates;
    await openMapsNavigation(latitude, longitude, customer.name);
  };

  const handleScheduleJob = () => {
    (navigation as any).navigate('Jobs', {
      screen: 'AddEditJob',
      params: { customerId: customer?.id },
    });
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SCHEDULED: return '#007AFF';
      case JobStatus.IN_PROGRESS: return '#FF9500';
      case JobStatus.COMPLETED: return '#34C759';
      case JobStatus.CANCELLED: return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const canEdit = user?.role === UserRole.ADMIN || user?.role === UserRole.SALESPERSON;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Customer not found</Text>
      </View>
    );
  }

  const totalPaid = jobs
    .filter((j) => j.status === JobStatus.COMPLETED)
    .reduce((sum, j) => sum + j.price, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Customer Info */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{customer.name}</Text>
            {customer.status === 'dnc' && (
              <Chip style={styles.dncChip} textStyle={styles.dncText}>DNC</Chip>
            )}
          </View>
          <Text style={styles.address}>
            {customer.address.street}{'\n'}
            {customer.address.city}, {customer.address.state} {customer.address.zipCode}
          </Text>
          <Text style={styles.revenue}>Total Revenue: ${totalPaid.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <View style={styles.actionRow}>
        <View style={styles.actionItem}>
          <Button mode="contained" icon="phone" onPress={handleCall} style={styles.circleBtn} compact>
            {''}
          </Button>
          <Text style={styles.actionLabel}>Call</Text>
        </View>
        <View style={styles.actionItem}>
          <Button mode="contained" icon="message" onPress={handleSMS} style={[styles.circleBtn, { backgroundColor: '#34C759' }]} compact>
            {''}
          </Button>
          <Text style={styles.actionLabel}>Text</Text>
        </View>
        {customer.email && (
          <View style={styles.actionItem}>
            <Button mode="contained" icon="email" onPress={handleEmail} style={[styles.circleBtn, { backgroundColor: '#FF9500' }]} compact>
              {''}
            </Button>
            <Text style={styles.actionLabel}>Email</Text>
          </View>
        )}
        <View style={styles.actionItem}>
          <Button mode="contained" icon="navigation" onPress={handleDirections} style={[styles.circleBtn, { backgroundColor: '#5856D6' }]} compact>
            {''}
          </Button>
          <Text style={styles.actionLabel}>Directions</Text>
        </View>
      </View>

      {/* Schedule Job button */}
      <Button
        mode="contained"
        icon="plus"
        onPress={handleScheduleJob}
        style={styles.scheduleButton}
      >
        Schedule New Job
      </Button>

      {/* Edit Customer (admin/salesperson) */}
      {canEdit && (
        <Button
          mode="outlined"
          icon="pencil"
          onPress={() => navigation.navigate('AddEditCustomer', { customerId: customer.id })}
          style={styles.editButton}
        >
          Edit Customer
        </Button>
      )}

      <Divider style={styles.divider} />

      {/* Job History */}
      <Text style={styles.sectionTitle}>Job History ({jobs.length})</Text>

      {jobs.length === 0 ? (
        <Text style={styles.emptyText}>No jobs yet</Text>
      ) : (
        jobs.map((job) => (
          <Card
            key={job.id}
            style={styles.jobCard}
            onPress={() => (navigation as any).navigate('Jobs', { screen: 'JobDetail', params: { jobId: job.id } })}
          >
            <Card.Content>
              <View style={styles.jobRow}>
                <View style={styles.jobLeft}>
                  <Text style={styles.jobDate}>
                    {job.scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                  <Text style={styles.jobTech}>By: {job.assignedToName}</Text>
                </View>
                <View style={styles.jobRight}>
                  <Text style={styles.jobPrice}>${job.price.toFixed(2)}</Text>
                  <Chip
                    style={[styles.statusChip, { backgroundColor: getStatusColor(job.status) }]}
                    textStyle={styles.chipText}
                    compact
                  >
                    {job.status.replace('_', ' ')}
                  </Chip>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginBottom: 12, elevation: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  name: { fontSize: 22, fontWeight: '700', color: '#1C1C1E' },
  dncChip: { backgroundColor: '#FF3B30' },
  dncText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  address: { fontSize: 15, color: '#3C3C43', lineHeight: 22 },
  revenue: { fontSize: 16, fontWeight: '700', color: '#34C759', marginTop: 8 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  actionItem: { alignItems: 'center', gap: 4 },
  circleBtn: { backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28 },
  actionLabel: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  scheduleButton: { backgroundColor: '#007AFF', marginBottom: 8 },
  editButton: { borderColor: '#007AFF', marginBottom: 8 },
  divider: { marginVertical: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#1C1C1E', marginBottom: 12 },
  emptyText: { color: '#8E8E93', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
  jobCard: { marginBottom: 8, elevation: 1 },
  jobRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobLeft: {},
  jobRight: { alignItems: 'flex-end', gap: 4 },
  jobDate: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  jobTech: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  jobPrice: { fontSize: 16, fontWeight: '700', color: '#34C759' },
  statusChip: { height: 22 },
  chipText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});
