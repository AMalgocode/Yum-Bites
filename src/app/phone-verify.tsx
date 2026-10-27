import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#FBF5EA',
  primary: '#D63A1A',
  title: '#3A1F14',
  text: '#2E3440',
  muted: '#6B7280',
  card: '#FFFDF9',
  divider: '#EFE8DA',
  white: '#FFFFFF',
};

const RESEND_SECONDS = 30;

export default function PhoneVerifyScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Countdown for the resend button
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  // DEMO ONLY: makes a random code and shows it as a fake SMS.
  // For a real app, replace this with a real SMS provider.
  const sendOtp = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(code);
    setOtp('');
    setError('');
    setSecondsLeft(RESEND_SECONDS);
    Alert.alert('📩 Demo SMS', `Your YummyBites OTP is ${code}\n(Demo mode: no real SMS is sent)`);
  };

  const handleSendPress = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    sendOtp();
    setStep('otp');
  };

  const handleVerifyPress = () => {
    if (otp === sentCode) {
      router.replace('/(tabs)');
    } else {
      setError('Wrong OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable
          onPress={() => (step === 'otp' ? setStep('phone') : router.back())}
          hitSlop={10}
          style={styles.back}>
          <Ionicons name="arrow-back" size={28} color={COLORS.title} />
        </Pressable>

        <Text style={styles.title}>
          {step === 'phone' ? 'Verify your number' : 'Enter the OTP'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'phone'
            ? "We'll send a 6-digit code to confirm it's you."
            : `Code sent to +91 ${phone}`}
        </Text>

        <View style={styles.card}>
          {step === 'phone' ? (
            <View style={styles.inputRow}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                style={styles.input}
                placeholder="10-digit mobile number"
                placeholderTextColor={COLORS.muted}
                keyboardType="number-pad"
                maxLength={10}
                value={phone}
                onChangeText={(t) => {
                  setPhone(t.replace(/\D/g, ''));
                  setError('');
                }}
              />
            </View>
          ) : (
            <TextInput
              style={[styles.input, styles.otpInput]}
              placeholder="••••••"
              placeholderTextColor={COLORS.muted}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={(t) => {
                setOtp(t.replace(/\D/g, ''));
                setError('');
              }}
            />
          )}
          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
          onPress={step === 'phone' ? handleSendPress : handleVerifyPress}>
          <Text style={styles.buttonText}>{step === 'phone' ? 'Send OTP' : 'Verify'}</Text>
        </Pressable>

        {step === 'otp' && (
          <Pressable disabled={secondsLeft > 0} onPress={sendOtp} style={styles.resend}>
            <Text style={[styles.resendText, secondsLeft > 0 && { color: COLORS.muted }]}>
              {secondsLeft > 0 ? `Resend OTP in ${secondsLeft}s` : 'Resend OTP'}
            </Text>
          </Pressable>
        )}

        <Text style={styles.note}>Demo mode: the OTP appears in a popup instead of an SMS.</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 24 },
  back: { marginBottom: 24, width: 30 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.title },
  subtitle: { fontSize: 16, color: COLORS.muted, marginTop: 8, marginBottom: 28, lineHeight: 22 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: 22,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  prefix: { fontSize: 18, color: COLORS.title, fontWeight: '700', marginRight: 12 },
  input: { flex: 1, fontSize: 18, color: COLORS.text, paddingVertical: 10 },
  otpInput: { textAlign: 'center', fontSize: 28, letterSpacing: 10, fontWeight: '700' },
  error: { color: COLORS.primary, marginTop: 8, fontSize: 14 },

  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 18,
  },
  buttonText: { color: COLORS.white, fontSize: 19, fontWeight: '700' },
  resend: { alignItems: 'center', marginTop: 18 },
  resendText: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  note: { textAlign: 'center', color: COLORS.muted, fontSize: 13, marginTop: 28 },
});