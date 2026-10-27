import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/context/cart-context';

const COLORS = {
  background: '#FDF8EF',
  primary: '#D0300F',
  title: '#1F1510',
  text: '#2E3440',
  muted: '#7A7F87',
  card: '#FFFDF9',
  divider: '#EFE8DA',
  summary: '#FBF1E2',
  etaBox: '#FBEBD0',
  chip: '#FCEBD5',
  white: '#FFFFFF',
};

const DELIVERY_FEE = 0;
const ETA_MINUTES = 20;

export default function ReviewOrderScreen() {
  const router = useRouter();
  const { items, totalPrice } = useCart();

  const subtotal = totalPrice;
  const total = subtotal + DELIVERY_FEE;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerSide} onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={28} color={COLORS.title} />
          </Pressable>
          <Text style={styles.title}>Review Your Order</Text>
          <View style={styles.headerSide} />
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Your Items</Text>

          {items.length === 0 && <Text style={styles.empty}>Your cart is empty.</Text>}

          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemImage}>
                <Text style={styles.itemLetter}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPlace}>{item.restaurantName}</Text>
              </View>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
            </View>
          ))}

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryBorder]}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{DELIVERY_FEE}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{total}</Text>
            </View>

            <View style={styles.etaBox}>
              <Text style={styles.etaLabel}>Estimated Ready Time</Text>
              <Text style={styles.etaValue}>{ETA_MINUTES} mins</Text>
            </View>
          </View>

          <Pressable
            disabled={items.length === 0}
            style={({ pressed }) => [
              styles.payButton,
              (pressed || items.length === 0) && { opacity: 0.6 },
            ]}
            onPress={() => router.push('/payment')}>
            <Text style={styles.payText}>Proceed to Pay</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingHorizontal: 4 },
  headerSide: { width: 30 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.title },

  panel: { backgroundColor: COLORS.card, borderRadius: 20, borderWidth: 1, borderColor: COLORS.divider, padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.title, marginBottom: 14, marginTop: 4 },
  empty: { fontSize: 16, color: COLORS.muted, textAlign: 'center', paddingVertical: 20 },

  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.divider,
    padding: 10,
    marginBottom: 12,
  },
  itemImage: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.chip, alignItems: 'center', justifyContent: 'center' },
  itemLetter: { fontSize: 28, fontWeight: '800', color: COLORS.primary },
  itemInfo: { flex: 1, marginLeft: 14 },
  itemName: { fontSize: 18, fontWeight: '700', color: COLORS.title },
  itemPlace: { fontSize: 15, color: COLORS.muted, marginTop: 4 },
  itemQty: { fontSize: 17, fontWeight: '600', color: COLORS.title, marginHorizontal: 12 },
  itemPrice: { fontSize: 18, fontWeight: '700', color: COLORS.title, minWidth: 56, textAlign: 'right' },

  summary: { backgroundColor: COLORS.summary, borderRadius: 16, padding: 14, marginTop: 10, marginBottom: 18 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6 },
  summaryBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.divider, paddingBottom: 16, marginBottom: 6 },
  summaryLabel: { fontSize: 16, color: COLORS.text },
  summaryValue: { fontSize: 17, fontWeight: '700', color: COLORS.title },
  totalLabel: { fontSize: 20, fontWeight: '800', color: COLORS.title },
  totalValue: { fontSize: 24, fontWeight: '800', color: COLORS.primary },

  etaBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.etaBox, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 14, marginTop: 10 },
  etaLabel: { fontSize: 17, fontWeight: '700', color: COLORS.title },
  etaValue: { fontSize: 18, fontWeight: '700', color: COLORS.primary },

  payButton: { backgroundColor: COLORS.primary, borderRadius: 16, alignItems: 'center', paddingVertical: 20 },
  payText: { color: COLORS.white, fontSize: 21, fontWeight: '700' },
});