import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#FBF5EA',
  primary: '#D63A1A',
  title: '#3A1F14',
  text: '#2E3440',
  muted: '#6B7280',
  card: '#FFFDF9',
  divider: '#EFE8DA',
  headerCard: '#FBEBD3',
  badgeBg: '#FDE6BE',
  badgeText: '#C2570C',
  white: '#FFFFFF',
};

// Placeholder order. We can load this from Firebase or your cart later.
const ORDER = {
  id: 'YB12345678',
  date: '10 May, 12:30 PM',
  status: 'Preparing',
  deliveryFee: 0,
  items: [
    { id: '1', name: 'Veg Meal', qty: 1, price: 90, emoji: '🥗' },
    { id: '2', name: 'Chicken Meal', qty: 1, price: 130, emoji: '🍗' },
    { id: '3', name: 'Cappuccino', qty: 1, price: 110, emoji: '☕' },
    { id: '4', name: 'Bread (Baguette)', qty: 1, price: 50, emoji: '🥖' },
  ],
};

export default function OrderDetailsScreen() {
  const router = useRouter();

  const subtotal = ORDER.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = subtotal + ORDER.deliveryFee;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerSide} onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={28} color={COLORS.title} />
          </Pressable>
          <Text style={styles.title}>Order Details</Text>
          <View style={styles.headerSide} />
        </View>

        {/* Order ID card */}
        <View style={styles.orderCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.orderLabel}>Order ID</Text>
            <Text style={styles.orderId}>{ORDER.id}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="time-outline" size={18} color={COLORS.muted} />
              <Text style={styles.dateText}>{ORDER.date}</Text>
            </View>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{ORDER.status}</Text>
          </View>
        </View>

        {/* Items card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>
          {ORDER.items.map((item, index) => (
            <View
              key={item.id}
              style={[styles.itemRow, index === ORDER.items.length - 1 && styles.lastRow]}>
              <View style={styles.itemImage}>
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQty}>×{item.qty}</Text>
              <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
            </View>
          ))}
        </View>

        {/* Totals card */}
        <View style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>₹{subtotal}</Text>
          </View>
          <View style={[styles.totalRow, styles.totalRowBorder]}>
            <Text style={styles.totalLabel}>Delivery Fee</Text>
            <Text style={styles.totalValue}>₹{ORDER.deliveryFee}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.grandLabel}>Total Amount</Text>
            <Text style={styles.grandValue}>₹{total}</Text>
          </View>
        </View>

        {/* Track order button */}
        <Pressable
          style={({ pressed }) => [styles.trackButton, pressed && { opacity: 0.85 }]}
          onPress={() => {
            // TODO: open a tracking screen when it exists
          }}>
          <Ionicons name="bag-handle-outline" size={24} color={COLORS.white} />
          <Text style={styles.trackText}>Track Order</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerSide: { width: 30 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.title },

  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.headerCard,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  orderLabel: { fontSize: 15, color: COLORS.muted },
  orderId: { fontSize: 26, fontWeight: '800', color: COLORS.title, marginVertical: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 15, color: COLORS.muted },
  badge: {
    backgroundColor: COLORS.badgeBg,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  badgeText: { color: COLORS.badgeText, fontWeight: '700', fontSize: 16 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.title, marginBottom: 8 },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  lastRow: { borderBottomWidth: 0 },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FCEBD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmoji: { fontSize: 28 },
  itemName: { flex: 1, marginLeft: 14, fontSize: 17, color: COLORS.text },
  itemQty: { fontSize: 17, color: COLORS.text, marginHorizontal: 14 },
  itemPrice: { fontSize: 17, color: COLORS.text, minWidth: 56, textAlign: 'right' },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingBottom: 14,
    marginBottom: 6,
  },
  totalLabel: { fontSize: 16, color: COLORS.muted },
  totalValue: { fontSize: 17, color: COLORS.text },
  grandLabel: { fontSize: 22, fontWeight: '800', color: COLORS.title },
  grandValue: { fontSize: 26, fontWeight: '800', color: COLORS.primary },

  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 18,
  },
  trackText: { color: COLORS.white, fontSize: 19, fontWeight: '700' },
});