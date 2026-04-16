import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { Text, TextInput, Button, Title } from 'react-native-paper';
import { useAuth } from '@contexts/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
    } catch (err: any) {
      const code = err.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please wait a moment and try again.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Title style={styles.title}>B.CLEAN</Title>
        <Text style={styles.subtitle}>Window Washing Operations Suite</Text>

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

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Sign In
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Register')}
          style={styles.linkButton}
        >
          New employee? Create account
        </Button>

        <Text style={styles.legalText}>
          By signing in, you agree to our{' '}
          <Text style={styles.legalLink} onPress={() => Linking.openURL('https://bclean.app/terms')}>
            Terms of Service
          </Text>
          {' '}and{' '}
          <Text style={styles.legalLink} onPress={() => Linking.openURL('https://bclean.app/privacy')}>
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#4CBB17',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 8,
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 8,
  },
  legalText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
  legalLink: {
    color: '#4CBB17',
    fontWeight: '600',
  },
});
