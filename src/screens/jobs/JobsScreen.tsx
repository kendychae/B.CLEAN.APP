import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Chip, ActivityIndicator } from 'react-native-paper';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@contexts/AuthContext';
import { Job, JobStatus } from '@types/index';

export default function JobsScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'jobs'),
      where('assignedTo', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData: Job[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        jobsData.push({
          id: doc.id,
          ...data,
          scheduledDate: data.scheduledDate instanceof Timestamp 
            ? data.scheduledDate.toDate() 
            : new Date(data.scheduledDate),
          completedAt: data.completedAt 
            ? (data.completedAt instanceof Timestamp 
              ? data.completedAt.toDate() 
              : new Date(data.completedAt))
            : undefined,
        } as Job);
      });
      setJobs(jobsData.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime()));
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SCHEDULED:
        return '#2196F3';
      case JobStatus.IN_PROGRESS:
        return '#FF9800';
      case JobStatus.COMPLETED:
        return '#4CAF50';
      case JobStatus.CANCELLED:
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const renderJob = ({ item }: { item: Job }) => (
    <Card style={styles.card} onPress={() => {}}>
      <Card.Content>
        <View style={styles.header}>
          <Title>{item.customerName}</Title>
          <Chip
            style={{ backgroundColor: getStatusColor(item.status) }}
            textStyle={{ color: '#fff' }}
          >
            {item.status}
          </Chip>
        </View>
        <Paragraph>Date: {item.scheduledDate.toLocaleDateString()}</Paragraph>
        <Paragraph>Time: {item.scheduledTime}</Paragraph>
        <Paragraph>Duration: {item.duration} minutes</Paragraph>
        <Paragraph style={styles.price}>Price: ${item.price.toFixed(2)}</Paragraph>
        {item.notes && <Paragraph style={styles.notes}>Notes: {item.notes}</Paragraph>}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
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
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#4CAF50',
  },
  notes: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#666',
  },
});
