import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { colors } from '@/constants/colors';

export default function VerifyEmail() {
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  const handleCheckVerified = async () => {
    setChecking(true);
    try {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Not verified yet', 'Please click the link in your email first.');
      }
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        Alert.alert('Sent', 'Verification email resent.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        We sent a verification link to {auth.currentUser?.email}. Please check your inbox (and spam
        folder) and click the link.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleCheckVerified} disabled={checking}>
        <Text style={styles.buttonText}>{checking ? 'Checking...' : "I've verified my email"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleResend} disabled={resending}>
        <Text style={styles.secondaryButtonText}>
          {resending ? 'Sending...' : 'Resend verification email'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary, textAlign: 'center', marginBottom: 16 },
  subtitle: { color: colors.textSecondary, textAlign: 'center', marginBottom: 32, lineHeight: 20 },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: colors.surface, fontWeight: '600', fontSize: 16 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  secondaryButtonText: { color: colors.primary, fontWeight: '600' },
  signOutText: { color: colors.textSecondary, textAlign: 'center' },
});