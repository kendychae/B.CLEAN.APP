import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button, Title, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '@contexts/AuthContext';
import { UserRole } from '@appTypes/index';

export default function RegisterScreen({ navigation }: any) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.TECHNICIAN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, createEmployee, user: currentUser } = useAuth();

  // When accessed from the Profile > AddEmployee route, the admin is already logged in
  const isAdminAddingEmployee = !!currentUser;

  const parseError = (err: any) => {
    const code = err.code || '';
    if (code === 'auth/email-already-in-use' || code === 'already-exists') {
      return 'That email is already registered. Use a different email.';
    } else if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    } else if (code === 'auth/weak-password') {
      return 'Password is too weak. Use at least 6 characters.';
    }
    return err.message || 'Something went wrong. Please try again.';
  };

  const handleRegister = async () => {
    if (!displayName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isAdminAddingEmployee) {
        // Admin is creating an employee — use Cloud Function (doesn't sign out admin)
        await createEmployee(email, password, displayName, role);
        Alert.alert('Employee Created', `${displayName} has been added successfully. They can now sign in with their email and password.`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        // New user self-registering
        await signUp(email, password, displayName, role);
      }
    } catch (err: any) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Title style={styles.title}>B.CLEAN</Title>
        <Text style={styles.subtitle}>
          {isAdminAddingEmployee ? 'Add New Employee' : 'Create Account'}
        </Text>

        <TextInput
          label="Full Name"
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <Text style={styles.roleLabel}>Role</Text>
        <SegmentedButtons
          value={role}
          onValueChange={(val) => setRole(val as UserRole)}
          buttons={[
            { value: UserRole.ADMIN, label: 'Admin' },
            { value: UserRole.SALESPERSON, label: 'Sales' },
            { value: UserRole.TECHNICIAN, label: 'Cleaner' },
          ]}
          style={styles.segmented}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor="#4CBB17"
        >
          {isAdminAddingEmployee ? 'Add Employee' : 'Create Account'}
        </Button>

        {!isAdminAddingEmployee && (
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}
            textColor="#4CBB17"
          >
            Already have an account? Sign In
          </Button>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#4CBB17' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32, color: '#666' },
  input: { marginBottom: 16 },
  roleLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  segmented: { marginBottom: 20 },
  button: { marginTop: 8, paddingVertical: 8 },
  linkButton: { marginTop: 8 },
  error: { color: '#FF3B30', textAlign: 'center', marginVertical: 8 },
});
