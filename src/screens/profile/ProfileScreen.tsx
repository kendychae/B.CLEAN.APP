import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, TextInput as RNTextInput, TouchableOpacity, Platform } from 'react-native';
import { List, Avatar, Button, Divider, Text, Icon } from 'react-native-paper';
import { useAuth } from '@contexts/AuthContext';
import { UserRole } from '@appTypes/index';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@config/firebase';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);

  const handleEditPhone = () => {
    setPhoneInput(user?.phoneNumber || '');
    setPhoneModalVisible(true);
  };

  const handleSavePhone = async () => {
    if (!user?.id) return;
    setSavingPhone(true);
    try {
      await updateDoc(doc(db, 'users', user.id), { phoneNumber: phoneInput.trim() });
      setPhoneModalVisible(false);
      Alert.alert('Saved', 'Phone number updated.');
    } catch {
      Alert.alert('Error', 'Could not save phone number.');
    } finally {
      setSavingPhone(false);
    }
  };

  const handleSignOut = async () => {
    const doSignOut = async () => {
      try {
        await signOut();
      } catch (error) {
        console.error('Sign out error:', error);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to sign out?')) {
        await doSignOut();
      }
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: doSignOut },
      ]);
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case UserRole.ADMIN:       return 'Administrator';
      case UserRole.SALESPERSON: return 'Salesperson';
      case UserRole.TECHNICIAN:  return 'Technician';
      default:                   return 'Unknown';
    }
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Phone number edit modal */}
      <Modal
        visible={phoneModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPhoneModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPhoneModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalBox} activeOpacity={1}>
            <Text style={styles.modalTitle}>Edit Phone Number</Text>
            <RNTextInput
              style={styles.modalInput}
              value={phoneInput}
              onChangeText={setPhoneInput}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setPhoneModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleSavePhone} disabled={savingPhone}>
                <Text style={styles.modalSaveText}>{savingPhone ? 'Saving…' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <View style={styles.header}>
        <Avatar.Text size={80} label={initials} style={styles.avatar} />
        <Text style={styles.name}>{user?.displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{getRoleLabel(user?.role)}</Text>
        </View>
      </View>

      <List.Section>
        <List.Subheader style={styles.subheader}>Account</List.Subheader>
        <View style={styles.section}>
          <List.Item
            title="Phone"
            description={user?.phoneNumber || 'Tap to set phone number'}
            left={(props) => <List.Icon {...props} icon="phone" color="#4CBB17" />}
            right={(props) => <List.Icon {...props} icon="pencil" color="#4CBB17" />}
            onPress={handleEditPhone}
          />
          <Divider />
          <List.Item
            title="My Availability"
            description="Mark days off and set your schedule"
            left={(props) => <List.Icon {...props} icon="calendar-clock" color="#4CBB17" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Availability')}
          />
        </View>
      </List.Section>

      {user?.role === UserRole.ADMIN && (
        <List.Section>
          <List.Subheader style={styles.subheader}>Admin Tools</List.Subheader>
          <View style={styles.section}>
            <List.Item
              title="Add Employee"
              description="Create a new employee account"
              left={(props) => <List.Icon {...props} icon="account-plus" color="#4CBB17" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('AddEmployee')}
            />
          </View>
        </List.Section>
      )}

      <Button
        mode="contained"
        onPress={handleSignOut}
        style={styles.signOutButton}
        buttonColor="#FF3B30"
        icon="logout"
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { paddingBottom: 40 },
  header: { backgroundColor: '#fff', padding: 24, alignItems: 'center', marginBottom: 8 },
  avatar: { backgroundColor: '#4CBB17', marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  email: { fontSize: 14, color: '#8E8E93', marginBottom: 10 },
  roleBadge: { backgroundColor: '#E8F8DC', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  roleText: { color: '#2D5A27', fontSize: 13, fontWeight: '600' },
  subheader: { fontSize: 13, color: '#8E8E93', fontWeight: '600', marginBottom: 0 },
  section: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, overflow: 'hidden' },
  signOutButton: { margin: 20, marginTop: 12, paddingVertical: 4 },
  // Phone modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E', marginBottom: 16 },
  modalInput: {
    borderWidth: 1.5, borderColor: '#4CBB17', borderRadius: 8,
    padding: 12, fontSize: 16, color: '#1C1C1E', marginBottom: 20,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalCancel: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, backgroundColor: '#F2F2F7' },
  modalCancelText: { color: '#8E8E93', fontSize: 15, fontWeight: '600' },
  modalSave: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, backgroundColor: '#4CBB17' },
  modalSaveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
