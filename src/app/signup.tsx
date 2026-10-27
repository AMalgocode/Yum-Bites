import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function SignupScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (fullName.trim().length < 2) return setError('Please enter your full name');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Please enter a valid email');
    if (!/^[6-9]\d{9}$/.test(phone)) return setError('Enter a valid 10-digit mobile number');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    if (!agreed) return setError('Please accept the Terms & Conditions');

    setError('');
    // DEMO: no account is created yet. Goes on to the phone verification page.
    // Later, call Firebase createUserWithEmailAndPassword here.
    router.push('/phone-verify');
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

          <Text style={styles.title}>Create Account 🎉</Text>
          <Text style={styles.subtitle}>Let’s get you started</Text>

          {/* Full name */}
          <View style={styles.field}>
            <Ionicons name="person-outline" size={24} color={COLORS.title} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={COLORS.muted}
              value={fullName}
              onChangeText={(t) => { setFullName(t); setError(''); }}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Ionicons name="mail-outline" size={24} color={COLORS.title} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.muted}
              value={email}
              onChangeText={(t) => { setEmail(t); setError(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Phone */}
          <View style={styles.field}>
            <Ionicons name="call-outline" size={24} color={COLORS.title} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor={COLORS.muted}
              value={phone}
              onChangeText={(t) => { setPhone(t.replace(/\D/g, '')); setError(''); }}
              keyboardType="number-pad"
              maxLength={10}
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

          {/* Confirm password */}
          <View style={styles.field}>
            <Ionicons name="lock-closed-outline" size={24} color={COLORS.title} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.muted}
              value={confirm}
              onChangeText={(t) => { setConfirm(t); setError(''); }}
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowConfirm((v) => !v)} hitSlop={10}>
              <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={26} color={COLORS.title} />
            </Pressable>
          </View>

          {/* Terms */}
          <View style={styles.termsRow}>
            <Pressable onPress={() => { setAgreed((v) => !v); setError(''); }} hitSlop={10}>
              <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
                {agreed && <Ionicons name="checkmark" size={18} color={COLORS.white} />}
              </View>
            </Pressable>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text
                style={styles.link}
                onPress={() => Alert.alert('Terms & Conditions', 'Demo terms and conditions go here.')}>
                Terms & Conditions
              </Text>
            </Text>
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
            onPress={handleCreate}>
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Pressable onPress={() => router.replace('/login')} hitSlop={10}>
              <Text style={[styles.link, { fontWeight: '700' }]}>Login</Text>
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
  back: { width: 30, marginBottom: 36 },

  title: { fontSize: 32, fontWeight: '800', color: COLORS.title, textAlign: 'center' },
  subtitle: { fontSize: 18, color: COLORS.muted, textAlign: 'center', marginTop: 10, marginBottom: 34 },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    marginBottom: 16,
    height: 66,
  },
  input: { flex: 1, marginLeft: 16, fontSize: 18, color: COLORS.text },

  termsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 22 },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.title,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  termsText: { marginLeft: 12, fontSize: 17, color: COLORS.text, flexShrink: 1 },
  link: { color: COLORS.primary, fontSize: 17 },

  error: { color: COLORS.primary, fontSize: 15, marginBottom: 12, textAlign: 'center' },

  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonText: { color: COLORS.white, fontSize: 21, fontWeight: '700' },

  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 34 },
  loginText: { fontSize: 17, color: COLORS.muted },
});