import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';

const COLORS = {
  background: '#FEF8F1',
  primary: '#D62A0C',
  title: '#1F1510',
  text: '#2E3440',
  muted: '#6B7280',
  card: '#FFFDF9',
  border: '#EFE3D0',
  white: '#FFFFFF',
};

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function friendlyError(code?: string, fallback?: string) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Wrong email or password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'No internet connection.';
    default:
      return fallback || 'Something went wrong. Please try again.';
  }
}

export default function LoginScreen() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const value = identifier.trim();

    if (/^[6-9]\d{9}$/.test(value)) {
      setError('Password login uses your email. For mobile, tap the Phone button below.');
      return;
    }
    if (!EMAIL_REGEX.test(value)) {
      setError('Please enter a valid email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, value, password);
      if (!cred.user.emailVerified) {
        router.replace('/verify-email');
        return;
      }
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(friendlyError(e?.code, e?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    const value = identifier.trim();
    if (!EMAIL_REGEX.test(value)) {
      setError('Type your email above first, then tap Forgot Password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, value);
      Alert.alert('Check your email', 'We sent a password reset link to your email.');
    } catch (e: any) {
      setError(friendlyError(e?.code, e?.message));
    }
  };

  const handleGoogle = () => {
    Alert.alert('Coming soon', "Google sign-in isn't available yet in this build.");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
            <Ionicons name="arrow-back" size={28} color={COLORS.title} />
          </Pressable>

          <Text style={styles.title}>Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          {/* Email / phone */}
          <View style={styles.field}>
            <Ionicons name="mail-outline" size={24} color={COLORS.title} />
            <TextInput
              style={styles.input}
              placeholder="Email / Phone"
              placeholderTextColor={COLORS.muted}
              value={identifier}
              onChangeText={(t) => { setIdentifier(t); setError(''); }}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Ionicons name="lock-closed-outline" size={24} color={COLORS.title} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.muted}
              value={password}
              onChangeText={(t) => { setPassword(t); setError(''); }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={26} color={COLORS.title} />
            </Pressable>
          </View>

          <Pressable style={styles.forgot} onPress={handleForgot}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            disabled={loading}
            style={({ pressed }) => [styles.loginButton, (pressed || loading) && { opacity: 0.7 }]}
            onPress={handleLogin}>
            <Text style={styles.loginText}>{loading ? 'Please wait...' : 'Login'}</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <Pressable
              style={({ pressed }) => [styles.socialButton, pressed && { opacity: 0.7 }]}
              onPress={handleGoogle}>
              <Ionicons name="logo-google" size={26} color="#DB4437" />
              <Text style={styles.socialText}>Google</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.socialButton, pressed && { opacity: 0.7 }]}
              onPress={() => router.push('/phone-verify')}>
              <Ionicons name="call" size={26} color={COLORS.title} />
              <Text style={styles.socialText}>Phone</Text>
            </Pressable>
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push('/signup')} hitSlop={10}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 24, paddingBottom: 40 },
  back: { width: 30, marginBottom: 48 },

  title: { fontSize: 32, fontWeight: '800', color: COLORS.title, textAlign: 'center' },
  subtitle: { fontSize: 19, color: COLORS.muted, textAlign: 'center', marginTop: 10, marginBottom: 40 },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    marginBottom: 18,
    height: 66,
  },
  input: { flex: 1, marginLeft: 16, fontSize: 18, color: COLORS.text },

  forgot: { alignSelf: 'flex-end', marginTop: 2, marginBottom: 30 },
  forgotText: { color: COLORS.primary, fontSize: 17, fontWeight: '600' },

  error: { color: COLORS.primary, fontSize: 15, marginBottom: 12, textAlign: 'center' },

  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 20,
  },
  loginText: { color: COLORS.white, fontSize: 21, fontWeight: '700' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { marginHorizontal: 16, fontSize: 16, color: COLORS.muted },

  socialRow: { flexDirection: 'row', gap: 16 },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: 20,
  },
  socialText: { fontSize: 19, fontWeight: '600', color: COLORS.title },

  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  signupText: { fontSize: 17, color: COLORS.muted },
  signupLink: { fontSize: 17, color: COLORS.primary, fontWeight: '700' },
});