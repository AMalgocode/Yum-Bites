import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
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
  chip: '#FCEBD5',
  white: '#FFFFFF',
};

export default function CartScreen() {
  const router = useRouter();
  const { items, increaseQuantity, decreaseQuantity, totalPrice, clearCart } = useCart();

  const handleClear = () => {
    Alert.alert('Clear cart?', 'This removes all items from your cart.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCart },
    ]);
  };

  const Header = (
    <View style={styles.header}>
      <Pressable style={styles.headerSide} onPress={() => router.back()} hitSlop={10}>
        <Ionicons name="arrow-back" size={28} color={COLORS.title} />
      </Pressable>
      <Text style={styles.title}>Your Cart</Text>
      <View style={styles.headerSide} />
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        {Header}
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add something tasty from a food center.</Text>
          <Pressable style={styles.browseButton} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.browseText}>Browse Food Centers</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {Header}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
            </View>

            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPlace}>{item.restaurantName}</Text>
              <Text style={styles.itemPrice}>₹{item.price} each</Text>
            </View>

            <View style={styles.qtyBox}>
              <Pressable style={styles.qtyButton} onPress={() => decreaseQuantity(item.id)} hitSlop={8}>
                <Ionicons name="remove" size={20} color={COLORS.white} />
              </Pressable>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <Pressable style={styles.qtyButton} onPress={() => increaseQuantity(item.id)} hitSlop={8}>
                <Ionicons name="add" size={20} color={COLORS.white} />
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Footer with total and checkout */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{totalPrice}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.checkoutButton, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/review-order')}>
          <Text style={styles.checkoutText}>Proceed to Checkout · ₹{totalPrice}</Text>
        </Pressable>

        <Pressable style={styles.clearButton} onPress={handleClear} hitSlop={8}>
          <Text style={styles.clearText}>Clear Cart</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 },
  headerSide: { width: 30 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.title },

  list: { paddingHorizontal: 20, paddingBottom: 20 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.divider,
    padding: 14,
    marginBottom: 12,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.chip, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
  itemInfo: { flex: 1, marginLeft: 14 },
  itemName: { fontSize: 18, fontWeight: '700', color: COLORS.title },
  itemPlace: { fontSize: 14, color: COLORS.muted, marginTop: 2 },
  itemPrice: { fontSize: 15, color: COLORS.text, marginTop: 4 },

  qtyBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 18, fontWeight: '700', color: COLORS.title, minWidth: 22, textAlign: 'center' },

  footer: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  totalLabel: { fontSize: 20, fontWeight: '700', color: COLORS.title },
  totalValue: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  checkoutButton: { backgroundColor: COLORS.primary, borderRadius: 16, alignItems: 'center', paddingVertical: 18 },
  checkoutText: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  clearButton: { alignItems: 'center', paddingVertical: 14 },
  clearText: { color: COLORS.muted, fontSize: 16, fontWeight: '600' },

  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyEmoji: { fontSize: 72 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: COLORS.title, marginTop: 12 },
  emptyText: { fontSize: 16, color: COLORS.muted, marginTop: 6, textAlign: 'center' },
  browseButton: { backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 28, marginTop: 24 },
  browseText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
});