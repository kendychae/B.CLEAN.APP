import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Avatar, Button, Divider, Text } from 'react-native-paper';
import { useAuth } from '@contexts/AuthContext';
import { UserRole } from '@types/index';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error('Sign out error:', error);
          }
        },
      },
    ]);
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
            description={user?.phoneNumber || 'Not set'}
            left={(props) => <List.Icon {...props} icon="phone" color="#007AFF" />}
          />
          <Divider />
          <List.Item
            title="My Availability"
            description="Mark days off and set your schedule"
            left={(props) => <List.Icon {...props} icon="calendar-clock" color="#007AFF" />}
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
              left={(props) => <List.Icon {...props} icon="account-plus" color="#007AFF" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => (navigation as any).navigate('Login', { screen: 'Register' })}
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
  avatar: { backgroundColor: '#007AFF', marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  email: { fontSize: 14, color: '#8E8E93', marginBottom: 10 },
  roleBadge: { backgroundColor: '#EBF5FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  roleText: { color: '#007AFF', fontSize: 13, fontWeight: '600' },
  subheader: { fontSize: 13, color: '#8E8E93', fontWeight: '600', marginBottom: 0 },
  section: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, overflow: 'hidden' },
  signOutButton: { margin: 20, marginTop: 12, paddingVertical: 4 },
});
