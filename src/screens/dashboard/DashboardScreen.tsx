import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { collection, query, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { useAuth } from '@contexts/AuthContext';
import { getAnalytics } from '@services/analytics';
import { Analytics, Job, JobStatus } from '@types/index';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [todayJobs, setTodayJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadAnalytics();

    const q = query(collection(db, 'jobs'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const jobs: Job[] = [];
      snap.forEach((d) => {
        const data = d.data();
        const scheduledDate = data.scheduledDate instanceof Timestamp
          ? data.scheduledDate.toDate()
          : new Date(data.scheduledDate);
        if (scheduledDate.toISOString().split('T')[0] === todayStr) {
          jobs.push({ id: d.id, ...data, scheduledDate } as Job);
        }
      });
      setTodayJobs(jobs.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)));
    });

    return unsubscribe;
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch {
      // analytics optional
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const completedToday = todayJobs.filter((j) => j.status === JobStatus.COMPLETED).length;
  const revenueToday = todayJobs
    .filter((j) => j.status === JobStatus.COMPLETED)
    .reduce((sum, j) => sum + j.price, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Good {getTimeOfDay()}, {user?.displayName?.split(' ')[0]}</Text>

      {/* Today Summary */}
      <Card style={styles.todayCard}>
        <Card.Content>
          <Text style={styles.todayTitle}>Today</Text>
          <View style={styles.todayRow}>
            <View style={styles.todayStat}>
              <Text style={styles.todayNum}>{todayJobs.length}</Text>
              <Text style={styles.todayLabel}>Jobs Scheduled</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.todayStat}>
              <Text style={[styles.todayNum, { color: '#34C759' }]}>{completedToday}</Text>
              <Text style={styles.todayLabel}>Completed</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.todayStat}>
              <Text style={[styles.todayNum, { color: '#34C759' }]}>${revenueToday.toFixed(0)}</Text>
              <Text style={styles.todayLabel}>Revenue</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Stats Grid */}
      <View style={styles.grid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={styles.statValue}>${analytics?.totalRevenue.toFixed(0) || '0'}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Total Jobs</Text>
            <Text style={styles.statValue}>{analytics?.totalJobs || 0}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={[styles.statValue, { color: '#34C759' }]}>{analytics?.completedJobs || 0}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Active Customers</Text>
            <Text style={styles.statValue}>{analytics?.activeCustomers || 0}</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Avg Job Value */}
      <Card style={styles.avgCard}>
        <Card.Content>
          <Text style={styles.statLabel}>Average Job Value</Text>
          <Text style={styles.avgValue}>${analytics?.averageJobValue.toFixed(2) || '0.00'}</Text>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('GroupSMS')}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionLabel}>Group SMS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => (navigation as any).navigate('Jobs', { screen: 'AddEditJob', params: {} })}>
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionLabel}>New Job</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => (navigation as any).navigate('Customers', { screen: 'AddEditCustomer', params: {} })}>
          <Text style={styles.actionIcon}>👤</Text>
          <Text style={styles.actionLabel}>Add Customer</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Jobs */}
      {todayJobs.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          {todayJobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              onPress={() => (navigation as any).navigate('Jobs', { screen: 'JobDetail', params: { jobId: job.id } })}
            >
              <Card style={styles.jobCard}>
                <Card.Content>
                  <View style={styles.jobRow}>
                    <View>
                      <Text style={styles.jobTime}>{job.scheduledTime}</Text>
                      <Text style={styles.jobCustomer}>{job.customerName}</Text>
                      <Text style={styles.jobTech}>{job.assignedToName}</Text>
                    </View>
                    <Text style={styles.jobPrice}>${job.price.toFixed(0)}</Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

// Need to import db from firebase config
import { db } from '@config/firebase';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  greeting: { fontSize: 22, fontWeight: '700', color: '#1C1C1E', marginBottom: 16 },
  todayCard: { marginBottom: 16, elevation: 1, backgroundColor: '#007AFF' },
  todayTitle: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: 12 },
  todayRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  todayStat: { alignItems: 'center' },
  todayNum: { fontSize: 28, fontWeight: '800', color: '#fff' },
  todayLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  separator: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.3)' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  statCard: { width: (width - 40) / 2, elevation: 1 },
  statLabel: { fontSize: 12, color: '#8E8E93', marginBottom: 4 },
  statValue: { fontSize: 26, fontWeight: '800', color: '#007AFF' },
  avgCard: { marginBottom: 16, elevation: 1 },
  avgValue: { fontSize: 28, fontWeight: '800', color: '#007AFF' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E', marginBottom: 10, marginTop: 8 },
  actionsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  actionCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1,
  },
  actionIcon: { fontSize: 24, marginBottom: 4 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: '#1C1C1E', textAlign: 'center' },
  jobCard: { marginBottom: 8, elevation: 1 },
  jobRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobTime: { fontSize: 13, fontWeight: '700', color: '#007AFF' },
  jobCustomer: { fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginTop: 2 },
  jobTech: { fontSize: 12, color: '#8E8E93', marginTop: 1 },
  jobPrice: { fontSize: 18, fontWeight: '700', color: '#34C759' },
});
