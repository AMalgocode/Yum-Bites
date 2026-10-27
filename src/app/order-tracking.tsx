import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#FBF5EA',
  primary: '#D63A1A',
  title: '#3A1F14',
  text: '#2E3440',
  muted: '#8A8F98',
  card: '#FFFDF9',
  divider: '#EFE8DA',
  headerCard: '#FBEBD3',
  badgeBg: '#FDE6BE',
  badgeText: '#C2570C',
  done: '#2E7D32',
  pending: '#B9B2A5',
  white: '#FFFFFF',
};

// Placeholder order. We can load this from Firebase later.
const ORDER = { id: 'YB12345678', placedOn: '10 May, 12:30 PM', status: 'Preparing', etaMinutes: 15 };

type StepState = 'done' | 'current' | 'pending';
const STEPS: { label: string; time: string; state: StepState }[] = [
  { label: 'Order Confirmed', time: '12:30 PM', state: 'done' },
  { label: 'Payment Successful', time: '12:31 PM', state: 'done' },
  { label: 'Food is Being Prepared', time: '12:32 PM', state: 'current' },
  { label: 'Almost Ready', time: '--:--', state: 'pending' },
  { label: 'Ready for Pickup', time: '--:--', state: 'pending' },
];

// Decorative confetti pieces for the popup
const CONFETTI = [
  { top: 70, left: 40, color: '#F9C22E', rotate: '45deg' },
  { top: 20, left: 90, color: '#F28C28', rotate: '-20deg' },
  { top: 110, left: 20, color: '#4CB8E6', rotate: '60deg' },
  { top: 150, left: 260, color: '#E53935', rotate: '-50deg' },
  { top: 60, left: 280, color: '#F9C22E', rotate: '30deg' },
  { top: 40, left: 230, color: '#4CB8E6', rotate: '70deg' },
  { top: 200, left: 14, color: '#E53935', rotate: '50deg' },
  { top: 250, left: 300, color: '#66BB6A', rotate: '-40deg' },
  { top: 270, left: 30, color: '#66BB6A', rotate: '35deg' },
  { top: 230, left: 280, color: '#F28C28', rotate: '55deg' },
];

export default function OrderTrackingScreen() {
  const router = useRouter();
  const [showReady, setShowReady] = useState(false);

  // DEMO: shows the "food is ready" popup 8 seconds after opening the page.
  // Later, replace this with a real status update from Firebase.
  useEffect(() => {
    const timer = setTimeout(() => setShowReady(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerSide} onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={28} color={COLORS.title} />
          </Pressable>
          <Text style={styles.title}>Order Tracking</Text>
          <View style={styles.headerSide} />
        </View>

        {/* Order info card */}
        <View style={styles.orderCard}>
          <View style={styles.orderRow}>
            <View>
              <Text style={styles.smallLabel}>Order ID</Text>
              <Text style={styles.orderId}>{ORDER.id}</Text>
            </View>
            <View>
              <Text style={styles.smallLabel}>Placed on</Text>
              <Text style={styles.placedOn}>{ORDER.placedOn}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{ORDER.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.timeline}>
          {STEPS.map((step, index) => {
            const isLast = index === STEPS.length - 1;
            const nextDone = !isLast && STEPS[index + 1].state !== 'pending';
            return (
              <View key={step.label} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View
                    style={[
                      styles.dot,
                      step.state === 'done' && styles.dotDone,
                      step.state === 'current' && styles.dotCurrent,
                      step.state === 'pending' && styles.dotPending,
                    ]}>
                    {step.state === 'done' && <Ionicons name="checkmark" size={20} color={COLORS.white} />}
                    {step.state === 'current' && <View style={styles.dotInner} />}
                  </View>
                  {!isLast && (
                    <View style={[styles.line, { backgroundColor: nextDone ? COLORS.done : COLORS.pending }]} />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    step.state === 'current' && styles.stepLabelCurrent,
                    step.state === 'pending' && { color: COLORS.muted },
                  ]}>
                  {step.label}
                </Text>
                <Text style={[styles.stepTime, step.state === 'pending' && { color: COLORS.muted }]}>
                  {step.time}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Estimated time card */}
        <View style={styles.etaCard}>
          <View>
            <Text style={styles.etaLabel}>Estimated ready in</Text>
            <Text style={styles.etaValue}>{ORDER.etaMinutes} min</Text>
          </View>
          <Text style={styles.etaEmoji}>⏱️</Text>
        </View>
      </ScrollView>

      {/* "Your food is ready" popup */}
      <Modal visible={showReady} transparent animationType="fade" onRequestClose={() => setShowReady(false)}>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.bell}>🔔</Text>

            {CONFETTI.map((c, i) => (
              <View
                key={i}
                style={[
                  styles.confetti,
                  { top: c.top, left: c.left, backgroundColor: c.color, transform: [{ rotate: c.rotate }] },
                ]}
              />
            ))}

            <Text style={styles.popupTitle}>🎉 Your Food is Ready!</Text>
            <Text style={styles.popupText}>
              Your order is ready for pickup. Please collect your food from the counter.
            </Text>

            <View style={styles.popupIdBox}>
              <Text style={styles.popupIdLabel}>Order ID</Text>
              <Text style={styles.popupId}>{ORDER.id}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.popupButton, pressed && { opacity: 0.85 }]}
              onPress={() => setShowReady(false)}>
              <Text style={styles.popupButtonText}>Ok, Got It</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerSide: { width: 30 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.title },

  orderCard: {
    backgroundColor: COLORS.headerCard,
    borderRadius: 18,
    padding: 18,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  smallLabel: { fontSize: 15, color: COLORS.text },
  orderId: { fontSize: 26, fontWeight: '800', color: COLORS.title, marginTop: 6 },
  placedOn: { fontSize: 16, color: COLORS.text, marginTop: 6 },
  badge: {
    backgroundColor: COLORS.badgeBg,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    marginTop: 12,
    alignItems: 'center',
  },
  badgeText: { color: COLORS.badgeText, fontWeight: '700', fontSize: 18 },

  sectionTitle: { fontSize: 22, fontWeight: '700', color: COLORS.title, marginBottom: 18 },

  timeline: { marginBottom: 24 },
  stepRow: { flexDirection: 'row', minHeight: 70 },
  stepLeft: { alignItems: 'center', width: 44 },
  dot: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: COLORS.done },
  dotCurrent: { backgroundColor: COLORS.primary },
  dotPending: { borderWidth: 3, borderColor: COLORS.pending, backgroundColor: 'transparent' },
  dotInner: { width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.white },
  line: { width: 4, flex: 1, marginVertical: 2, borderRadius: 2 },
  stepLabel: { flex: 1, marginLeft: 12, marginTop: 8, fontSize: 18, color: COLORS.text },
  stepLabelCurrent: { fontWeight: '800', color: COLORS.title },
  stepTime: { marginTop: 8, fontSize: 16, color: COLORS.text },

  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.headerCard,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  etaLabel: { fontSize: 18, color: COLORS.text },
  etaValue: { fontSize: 40, fontWeight: '800', color: COLORS.primary, marginTop: 4 },
  etaEmoji: { fontSize: 64 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  popup: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.background,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 70,
    paddingBottom: 24,
    alignItems: 'center',
  },
  bell: { position: 'absolute', top: -48, fontSize: 90 },
  confetti: { position: 'absolute', width: 8, height: 20, borderRadius: 4 },
  popupTitle: { fontSize: 25, fontWeight: '800', color: COLORS.title, textAlign: 'center', marginBottom: 12 },
  popupText: { fontSize: 17, color: COLORS.muted, textAlign: 'center', lineHeight: 26, marginBottom: 18 },
  popupIdBox: {
    width: '100%',
    backgroundColor: '#F8EBD7',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 20,
  },
  popupIdLabel: { fontSize: 16, color: COLORS.muted },
  popupId: { fontSize: 24, fontWeight: '800', color: COLORS.title, marginTop: 2 },
  popupButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 18,
  },
  popupButtonText: { color: COLORS.white, fontSize: 19, fontWeight: '700' },
});