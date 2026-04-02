import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Title, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '@contexts/AuthContext';
import { UserRole } from '@types/index';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';

type Props = StackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.TECHNICIAN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

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
      await signUp(email, password, displayName, role);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
        <Text style={styles.subtitle}>Create Account</Text>

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
        >
          Create Account
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.linkButton}
        >
          Already have an account? Sign In
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#007AFF' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32, color: '#666' },
  input: { marginBottom: 16 },
  roleLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  segmented: { marginBottom: 20 },
  button: { marginTop: 8, paddingVertical: 8 },
  linkButton: { marginTop: 8 },
  error: { color: '#FF3B30', textAlign: 'center', marginVertical: 8 },
});
