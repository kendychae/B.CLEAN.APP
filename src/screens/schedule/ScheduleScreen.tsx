import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ActivityIndicator } from 'react-native-paper';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@contexts/AuthContext';
import { Job } from '@types/index';

export default function ScheduleScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState<any>({});

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
        } as Job);
      });
      setJobs(jobsData);
      
      // Create marked dates object
      const marked: any = {};
      jobsData.forEach((job) => {
        const dateString = job.scheduledDate.toISOString().split('T')[0];
        marked[dateString] = { marked: true, dotColor: '#007AFF' };
      });
      setMarkedDates(marked);
      
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => {
          // Show jobs for selected day
        }}
        theme={{
          selectedDayBackgroundColor: '#007AFF',
          todayTextColor: '#007AFF',
          dotColor: '#007AFF',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
