import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { colors } from '@/constants/colors';

export default function VerifyEmail() {
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!auth.currentUser) return;
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        clearInterval(interval);
        router.replace('/(tabs)');
      }
    }, 3000); // checks every 3 seconds

    return () => clearInterval(interval);
  }, []);

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
        We sent a verification link to {auth.currentUser?.email}. Please check your inbox (and
        spam folder) and click the link.
      </Text>

      <View style={styles.waitingBox}>
        <ActivityIndicator color={colors.primary} size="small" />
        <Text style={styles.waitingText}>Waiting for verification...</Text>
      </View>

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
  subtitle: { color: colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  waitingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  },
  waitingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
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