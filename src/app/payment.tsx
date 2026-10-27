import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#FDF8EF',
  primary: '#D0300F',
  title: '#1F1510',
  text: '#2E3440',
  muted: '#6B7280',
  card: '#FFFDF9',
  divider: '#EFE8DA',
  radioOff: '#B9B2A5',
  white: '#FFFFFF',
};

// Placeholder total. We can connect this to your cart later.
const TOTAL = 370;

type MethodKey = 'upi' | 'card' | 'netbanking' | 'cash';

const METHODS: { key: MethodKey; title: string; subtitle: string }[] = [
  { key: 'upi', title: 'UPI', subtitle: 'Pay using any UPI app' },
  { key: 'card', title: 'Credit / Debit Card', subtitle: 'Visa, MasterCard, RuPay' },
  { key: 'netbanking', title: 'Net Banking', subtitle: 'All major banks' },
  { key: 'cash', title: 'Cash on Pickup', subtitle: 'Pay at the counter' },
];

function MethodIcon({ method }: { method: MethodKey }) {
  switch (method) {
    case 'upi':
      return <Text style={styles.upiLogo}>UPI</Text>;
    case 'card':
      return <Ionicons name="card" size={40} color="#4B4F58" />;
    case 'netbanking':
      return <Ionicons name="business" size={40} color="#4B4F58" />;
    case 'cash':
      return <Ionicons name="cash" size={44} color="#6BA83A" />;
  }
}

export default function PaymentScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<MethodKey>('upi');

  // DEMO: no real payment happens. Goes straight to the confirmation page.
  const handlePay = () => {
    router.replace('/order-confirmed');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerSide} onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={28} color={COLORS.title} />
          </Pressable>
          <Text style={styles.title}>Payment</Text>
          <View style={styles.headerSide} />
        </View>

        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        {/* Payment options */}
        {METHODS.map((m) => {
          const active = selected === m.key;
          return (
            <Pressable
              key={m.key}
              onPress={() => setSelected(m.key)}
              style={[styles.option, active && styles.optionActive]}>
              <View style={styles.iconBox}>
                <MethodIcon method={m.key} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{m.title}</Text>
                <Text style={styles.optionSubtitle}>{m.subtitle}</Text>
              </View>
              <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                {active && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          );
        })}

        {/* Pay button */}
        <Pressable
          style={({ pressed }) => [styles.payButton, pressed && { opacity: 0.85 }]}
          onPress={handlePay}>
          <Ionicons name="lock-closed-outline" size={24} color={COLORS.white} />
          <Text style={styles.payText}>
            {selected === 'cash' ? `Place Order ₹${TOTAL}` : `Pay ₹${TOTAL}`}
          </Text>
        </Pressable>

        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.muted} />
          <Text style={styles.secureText}>Secure & Safe Payment</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  headerSide: { width: 30 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.title },

  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.title, marginBottom: 16 },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.divider,
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  optionActive: { borderColor: '#F0C9BD' },
  iconBox: { width: 70, alignItems: 'center', justifyContent: 'center' },
  upiLogo: { fontSize: 28, fontWeight: '900', fontStyle: 'italic', color: '#4B4F58', letterSpacing: 1 },
  optionText: { flex: 1, marginLeft: 18 },
  optionTitle: { fontSize: 19, fontWeight: '700', color: COLORS.title },
  optionSubtitle: { fontSize: 16, color: COLORS.muted, marginTop: 4 },

  radioOuter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2.5,
    borderColor: COLORS.radioOff,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: { borderColor: COLORS.primary },
  radioInner: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.primary },

  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 20,
    marginTop: 14,
  },
  payText: { color: COLORS.white, fontSize: 22, fontWeight: '700' },

  secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 22 },
  secureText: { fontSize: 17, color: COLORS.muted },
});