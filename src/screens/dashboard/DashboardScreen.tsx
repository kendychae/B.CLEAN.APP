import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '@contexts/AuthContext';
import { getAnalytics } from '@services/analytics';
import { Analytics } from '@types/index';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.header}>Welcome, {user?.displayName}</Title>

        <View style={styles.row}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Paragraph style={styles.statLabel}>Total Revenue</Paragraph>
              <Title style={styles.statValue}>
                ${analytics?.totalRevenue.toFixed(2) || '0.00'}
              </Title>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Paragraph style={styles.statLabel}>Total Jobs</Paragraph>
              <Title style={styles.statValue}>{analytics?.totalJobs || 0}</Title>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.row}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Paragraph style={styles.statLabel}>Completed Jobs</Paragraph>
              <Title style={styles.statValue}>{analytics?.completedJobs || 0}</Title>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Paragraph style={styles.statLabel}>Active Customers</Paragraph>
              <Title style={styles.statValue}>{analytics?.activeCustomers || 0}</Title>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.fullCard}>
          <Card.Content>
            <Paragraph style={styles.statLabel}>Average Job Value</Paragraph>
            <Title style={styles.statValue}>
              ${analytics?.averageJobValue.toFixed(2) || '0.00'}
            </Title>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: (width - 48) / 2,
    elevation: 2,
  },
  fullCard: {
    width: '100%',
    elevation: 2,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
