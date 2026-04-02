import React, { useEffect, useState, useRef } from 'react';
import {
  View, ScrollView, StyleSheet, Alert, Image, TouchableOpacity,
  Modal, Dimensions, Platform,
} from 'react-native';
import {
  Text, Button, Card, Chip, ActivityIndicator, Divider, IconButton,
} from 'react-native-paper';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@contexts/AuthContext';
import { Job, JobStatus, PaymentStatus, UserRole } from '@types/index';
import { openMapsNavigation } from '@services/location';
import { takePicture } from '@services/photos';
import { uploadJobPhoto } from '@services/photos';
import { sendSMS } from '@services/communication';
import { scheduleJobReminder } from '@services/notifications';
import { StackScreenProps } from '@react-navigation/stack';
import { JobsStackParamList } from '@navigation/types';
import SignatureScreen from 'react-native-signature-canvas';

type Props = StackScreenProps<JobsStackParamList, 'JobDetail'>;

const { width } = Dimensions.get('window');
const GOOGLE_REVIEW_LINK = 'https://www.google.com/maps/place/B+Clean+4+Step+Window+and+Carpet+Cleaning/@41.7411581,-111.8494372,17z/data=!4m8!3m7!1s0x49c4b446d3a80447:0xcfe8e0ddc6523ead!8m2!3d41.7411581!4d-111.8494372!9m1!1b1!16s%2Fg%2F11vxgsznf9';

export default function JobDetailScreen({ route, navigation }: Props) {
  const { jobId } = route.params;
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [signatureVisible, setSignatureVisible] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const sigRef = useRef<any>(null);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    try {
      const docRef = doc(db, 'jobs', jobId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setJob({
          id: snap.id,
          ...data,
          scheduledDate: data.scheduledDate instanceof Timestamp
            ? data.scheduledDate.toDate()
            : new Date(data.scheduledDate),
          completedAt: data.completedAt
            ? (data.completedAt instanceof Timestamp ? data.completedAt.toDate() : new Date(data.completedAt))
            : undefined,
        } as Job);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleGPS = async () => {
    if (!job) return;
    try {
      const customerSnap = await getDoc(doc(db, 'customers', job.customerId));
      if (customerSnap.exists()) {
        const customer = customerSnap.data();
        const { latitude, longitude } = customer.address.coordinates;
        await openMapsNavigation(latitude, longitude, job.customerName);
      }
    } catch {
      Alert.alert('Error', 'Could not open navigation');
    }
  };

  const handleTakePhoto = async (type: 'before' | 'after') => {
    if (!job) return;
    try {
      const photo = await takePicture();
      if (!photo) return;
      setActionLoading(true);
      const url = await uploadJobPhoto(job.id, photo.uri, type);
      const field = type === 'before' ? 'beforePhotos' : 'afterPhotos';
      const existing = type === 'before' ? (job.beforePhotos || []) : (job.afterPhotos || []);
      await updateDoc(doc(db, 'jobs', job.id), {
        [field]: [...existing, url],
        updatedAt: Timestamp.now(),
      });
      setJob((prev) => prev ? {
        ...prev,
        [field]: [...existing, url],
      } : prev);
    } catch {
      Alert.alert('Error', 'Could not upload photo');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartJob = async () => {
    if (!job) return;
    try {
      await updateDoc(doc(db, 'jobs', job.id), {
        status: JobStatus.IN_PROGRESS,
        updatedAt: Timestamp.now(),
      });
      setJob((prev) => prev ? { ...prev, status: JobStatus.IN_PROGRESS } : prev);
    } catch {
      Alert.alert('Error', 'Could not update job status');
    }
  };

  const handleSaveSignature = async (sig: string) => {
    setSignatureVisible(false);
    if (!job) return;
    setActionLoading(true);
    try {
      await updateDoc(doc(db, 'jobs', job.id), {
        signature: sig,
        updatedAt: Timestamp.now(),
      });
      setJob((prev) => prev ? { ...prev, signature: sig } : prev);
      setSignature(sig);
    } catch {
      Alert.alert('Error', 'Could not save signature');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteJob = async () => {
    if (!job) return;
    if (!job.signature && !signature) {
      Alert.alert('Signature Required', 'Please capture customer signature before completing the job.');
      return;
    }
    Alert.alert('Complete Job', 'Mark this job as completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        onPress: async () => {
          setActionLoading(true);
          try {
            await updateDoc(doc(db, 'jobs', job.id), {
              status: JobStatus.COMPLETED,
              completedAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            });
            setJob((prev) => prev ? {
              ...prev,
              status: JobStatus.COMPLETED,
              completedAt: new Date(),
            } : prev);
            promptPostCompletion();
          } catch {
            Alert.alert('Error', 'Could not complete job');
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  const promptPostCompletion = () => {
    Alert.alert(
      'Job Completed!',
      'What would you like to do next?',
      [
        { text: 'Done', style: 'cancel' },
        { text: 'Send Invoice', onPress: handleSendInvoice },
        { text: 'Request Review', onPress: handleSendReview },
      ]
    );
  };

  const handleSendInvoice = async () => {
    if (!job) return;
    try {
      const customerSnap = await getDoc(doc(db, 'customers', job.customerId));
      if (!customerSnap.exists()) return;
      const customer = customerSnap.data();
      const message = `Hi ${customer.name}! Your B.CLEAN window washing service is complete. Amount due: $${job.price.toFixed(2)}. Thank you for your business!`;
      await sendSMS(customer.phone, message);
    } catch {
      Alert.alert('Error', 'Could not send invoice message');
    }
  };

  const handleSendReview = async () => {
    if (!job) return;
    try {
      const customerSnap = await getDoc(doc(db, 'customers', job.customerId));
      if (!customerSnap.exists()) return;
      const customer = customerSnap.data();
      const message = `Hi ${customer.name}! Thank you for choosing B.CLEAN. We'd love your feedback — please leave us a 5-star review: ${GOOGLE_REVIEW_LINK}`;
      await sendSMS(customer.phone, message);
    } catch {
      Alert.alert('Error', 'Could not send review request');
    }
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
  const canComplete = job?.status !== JobStatus.COMPLETED && job?.status !== JobStatus.CANCELLED;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Job not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Status & Header */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <Text style={styles.customerName}>{job.customerName}</Text>
            <Chip
              style={[styles.statusChip, { backgroundColor: getStatusColor(job.status) }]}
              textStyle={styles.chipText}
            >
              {job.status.replace('_', ' ').toUpperCase()}
            </Chip>
          </View>
          <Text style={styles.dateText}>
            {job.scheduledDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Text style={styles.timeText}>{job.scheduledTime} · {job.duration} min</Text>
          <Text style={styles.priceText}>${job.price.toFixed(2)}</Text>
          <Text style={styles.techText}>Assigned to: {job.assignedToName}</Text>
          {job.notes ? <Text style={styles.notesText}>{job.notes}</Text> : null}
        </Card.Content>
      </Card>

      {/* GPS Navigation */}
      <Button
        mode="contained"
        icon="navigation"
        onPress={handleGPS}
        style={styles.gpsButton}
        contentStyle={styles.gpsContent}
      >
        Open in Maps
      </Button>

      {/* Admin/Salesperson: Edit Job */}
      {canEdit && (
        <Button
          mode="outlined"
          icon="pencil"
          onPress={() => navigation.navigate('AddEditJob', { jobId: job.id })}
          style={styles.editButton}
        >
          Edit Job
        </Button>
      )}

      <Divider style={styles.divider} />

      {/* Job Actions */}
      {canComplete && (
        <>
          {job.status === JobStatus.SCHEDULED && (
            <Button
              mode="contained"
              icon="play"
              onPress={handleStartJob}
              style={[styles.actionButton, { backgroundColor: '#FF9500' }]}
              loading={actionLoading}
            >
              Start Job
            </Button>
          )}

          {job.status === JobStatus.IN_PROGRESS && (
            <Button
              mode="contained"
              icon="check"
              onPress={handleCompleteJob}
              style={[styles.actionButton, { backgroundColor: '#34C759' }]}
              loading={actionLoading}
            >
              Complete Job
            </Button>
          )}
        </>
      )}

      {/* Before Photos */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Before Photos</Text>
            {canComplete && (
              <IconButton icon="camera" size={22} iconColor="#007AFF" onPress={() => handleTakePhoto('before')} />
            )}
          </View>
          {job.beforePhotos && job.beforePhotos.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {job.beforePhotos.map((url, idx) => (
                <Image key={idx} source={{ uri: url }} style={styles.photo} />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>No before photos yet</Text>
          )}
        </Card.Content>
      </Card>

      {/* After Photos */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>After Photos</Text>
            {canComplete && (
              <IconButton icon="camera" size={22} iconColor="#007AFF" onPress={() => handleTakePhoto('after')} />
            )}
          </View>
          {job.afterPhotos && job.afterPhotos.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {job.afterPhotos.map((url, idx) => (
                <Image key={idx} source={{ uri: url }} style={styles.photo} />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>No after photos yet</Text>
          )}
        </Card.Content>
      </Card>

      {/* Signature */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Customer Signature</Text>
            {canComplete && !job.signature && (
              <Button mode="text" compact onPress={() => setSignatureVisible(true)}>
                Capture
              </Button>
            )}
          </View>
          {job.signature || signature ? (
            <Image
              source={{ uri: job.signature || signature || '' }}
              style={styles.signatureImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.emptyText}>No signature yet</Text>
          )}
        </Card.Content>
      </Card>

      {/* Post-completion actions */}
      {job.status === JobStatus.COMPLETED && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Follow-Up</Text>
            <Button
              mode="outlined"
              icon="file-document"
              onPress={handleSendInvoice}
              style={styles.followUpButton}
            >
              Send Invoice via SMS
            </Button>
            <Button
              mode="outlined"
              icon="star"
              onPress={handleSendReview}
              style={styles.followUpButton}
            >
              Request Google Review
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Signature Modal */}
      <Modal visible={signatureVisible} animationType="slide" onRequestClose={() => setSignatureVisible(false)}>
        <View style={styles.sigModal}>
          <View style={styles.sigHeader}>
            <Text style={styles.sigTitle}>Customer Signature</Text>
            <IconButton icon="close" onPress={() => setSignatureVisible(false)} />
          </View>
          <SignatureScreen
            ref={sigRef}
            onOK={handleSaveSignature}
            onEmpty={() => Alert.alert('Please sign before saving')}
            descriptionText="Sign here"
            clearText="Clear"
            confirmText="Save Signature"
            webStyle={`.m-signature-pad { box-shadow: none; border: none; }
              .m-signature-pad--body { border: 1px solid #ddd; }
              .m-signature-pad--footer { background-color: #f5f5f5; }
              body, html { background-color: #f5f5f5; }`}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#8E8E93', fontSize: 16 },
  card: { marginBottom: 12, elevation: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  customerName: { fontSize: 20, fontWeight: '700', color: '#1C1C1E', flex: 1, marginRight: 8 },
  statusChip: { height: 28 },
  chipText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  dateText: { fontSize: 15, color: '#3C3C43', marginTop: 2 },
  timeText: { fontSize: 14, color: '#8E8E93', marginTop: 2 },
  priceText: { fontSize: 22, fontWeight: '700', color: '#34C759', marginTop: 8 },
  techText: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  notesText: { fontSize: 14, color: '#3C3C43', marginTop: 8, fontStyle: 'italic' },
  gpsButton: { backgroundColor: '#007AFF', marginBottom: 8 },
  gpsContent: { paddingVertical: 4 },
  editButton: { marginBottom: 8, borderColor: '#007AFF' },
  divider: { marginVertical: 8 },
  actionButton: { marginBottom: 8, paddingVertical: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  photo: { width: 100, height: 100, borderRadius: 8, marginRight: 8 },
  emptyText: { color: '#8E8E93', fontStyle: 'italic', fontSize: 14 },
  signatureImage: { width: '100%', height: 120, backgroundColor: '#F5F5F5', borderRadius: 8 },
  followUpButton: { marginBottom: 8 },
  sigModal: { flex: 1, backgroundColor: '#F5F5F5' },
  sigHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  sigTitle: { fontSize: 18, fontWeight: '600', color: '#1C1C1E' },
});
