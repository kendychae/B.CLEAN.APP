import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Avatar, Button } from 'react-native-paper';
import { useAuth } from '@contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.displayName.charAt(0) || 'U'}
          style={styles.avatar}
        />
        <List.Item
          title={user?.displayName}
          description={user?.email}
          style={styles.userInfo}
        />
      </View>

      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Role"
          description={user?.role.toUpperCase()}
          left={(props) => <List.Icon {...props} icon="account-badge" />}
        />
        <List.Item
          title="Phone"
          description={user?.phoneNumber || 'Not set'}
          left={(props) => <List.Icon {...props} icon="phone" />}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Settings</List.Subheader>
        <List.Item
          title="Notifications"
          left={(props) => <List.Icon {...props} icon="bell" />}
          onPress={() => {}}
        />
        <List.Item
          title="Availability"
          left={(props) => <List.Icon {...props} icon="calendar-clock" />}
          onPress={() => {}}
        />
        <List.Item
          title="Theme"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          onPress={() => {}}
        />
      </List.Section>

      <Button
        mode="contained"
        onPress={handleSignOut}
        style={styles.signOutButton}
        buttonColor="#F44336"
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: '#007AFF',
    marginBottom: 16,
  },
  userInfo: {
    width: '100%',
  },
  signOutButton: {
    margin: 20,
    paddingVertical: 8,
  },
});
