import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#FDF6EC',
  primary: '#D0300F',
  title: '#2A1A12',
  text: '#2E3440',
  muted: '#6B7280',
  card: '#FFFDF9',
  cardTop: '#FCEBD0',
  divider: '#EFE8DA',
  white: '#FFFFFF',
};

// Placeholder order. We can connect this to the cart and Firebase later.
const ORDER = { id: 'YB12345678', items: 4, total: 370, etaMinutes: 20 };

// Decorative confetti around the check mark (left/top are percentages of the top area)
const CONFETTI = [
  { top: '8%', left: '12%', color: '#E8441E', rotate: '40deg' },
  { top: '4%', left: '30%', color: '#F9B233', rotate: '-30deg' },
  { top: '2%', left: '42%', color: '#E83E8C', rotate: '70deg' },
  { top: '3%', left: '60%', color: '#E8441E', rotate: '15deg' },
  { top: '8%', left: '76%', color: '#4CB8A6', rotate: '-50deg' },
  { top: '6%', left: '88%', color: '#F9A03F', rotate: '40deg' },
  { top: '20%', left: '4%', color: '#66BB6A', rotate: '20deg' },
  { top: '22%', left: '22%', color: '#E83E8C', rotate: '-45deg' },
  { top: '16%', left: '48%', color: '#4C7BE8', rotate: '60deg' },
  { top: '18%', left: '70%', color: '#4C7BE8', rotate: '-40deg' },
  { top: '24%', left: '90%', color: '#43A877', rotate: '30deg' },
  { top: '34%', left: '10%', color: '#E83E8C', rotate: '45deg' },
  { top: '38%', left: '28%', color: '#4C7BE8', rotate: '-10deg' },
  { top: '34%', left: '78%', color: '#F9B233', rotate: '35deg' },
  { top: '44%', left: '88%', color: '#4CB8E6', rotate: '0deg' },
  { top: '54%', left: '18%', color: '#4CB8E6', rotate: '30deg' },
  { top: '48%', left: '36%', color: '#F9B233', rotate: '-35deg' },
  { top: '50%', left: '64%', color: '#F28C28', rotate: '15deg' },
  { top: '60%', left: '72%', color: '#66BB6A', rotate: '55deg' },
  { top: '66%', left: '90%', color: '#F28C28', rotate: '-20deg' },
  { top: '62%', left: '6%', color: '#E8441E', rotate: '50deg' },
  { top: '70%', left: '48%', color: '#E8441E', rotate: '-60deg' },
];

export default function OrderConfirmedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Check mark with confetti */}
        <View style={styles.hero}>
          {CONFETTI.map((c, i) => (
            <View
              key={i}
              style={[
                styles.confetti,
                { top: c.top as any, left: c.left as any, backgroundColor: c.color, transform: [{ rotate: c.rotate }] },
              ]}
            />
          ))}
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={96} color={COLORS.white} />
          </View>
        </View>

        <Text style={styles.title}>🎉 Order Confirmed!</Text>
        <Text style={styles.subtitle}>Your food is being prepared.</Text>

        {/* Order summary card */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.cardLabel}>Order ID</Text>
            <Text style={styles.orderId}>{ORDER.id}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Items</Text>
            <Text style={styles.rowValue}>{ORDER.items} Items</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total Amount</Text>
            <Text style={styles.rowValue}>₹{ORDER.total}</Text>
          </View>
          <View style={[styles.row, styles.lastRow]}>
            <Text style={styles.rowLabel}>Estimated Time</Text>
            <Text style={[styles.rowValue, styles.eta]}>{ORDER.etaMinutes} min</Text>
          </View>
        </View>

        {/* Buttons */}
        <Pressable
          style={({ pressed }) => [styles.trackButton, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/order-tracking')}>
          <Ionicons name="cube-outline" size={26} color={COLORS.white} />
          <Text style={styles.trackText}>Track Order</Text>
        </Pressable>

        <Pressable style={styles.homeButton} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.homeText}>Go to Home</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 24, paddingBottom: 40 },

  hero: { height: 280, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  confetti: { position: 'absolute', width: 8, height: 20, borderRadius: 4 },
  checkCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: { fontSize: 30, fontWeight: '800', color: COLORS.title, textAlign: 'center' },
  subtitle: { fontSize: 18, color: COLORS.muted, textAlign: 'center', marginTop: 10, marginBottom: 30 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.divider,
    overflow: 'hidden',
    marginBottom: 28,
  },
  cardTop: { backgroundColor: COLORS.cardTop, paddingHorizontal: 22, paddingVertical: 20 },
  cardLabel: { fontSize: 18, color: COLORS.muted },
  orderId: { fontSize: 30, fontWeight: '800', color: COLORS.title, marginTop: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 22,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  lastRow: { borderBottomWidth: 0 },
  rowLabel: { fontSize: 17, color: COLORS.muted },
  rowValue: { fontSize: 19, fontWeight: '700', color: COLORS.title },
  eta: { color: COLORS.primary },

  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 20,
  },
  trackText: { color: COLORS.white, fontSize: 21, fontWeight: '700' },
  homeButton: { alignItems: 'center', marginTop: 28 },
  homeText: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
});