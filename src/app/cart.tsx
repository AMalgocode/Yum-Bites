import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useCart } from '@/context/cart-context';
import { colors } from '@/constants/colors';

export default function CartScreen() {
  const { items, increaseQuantity, decreaseQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Your Cart</Text>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Browse Food Centers</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Your Cart</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
              <Text style={styles.itemPrice}>₹{item.price} each</Text>
            </View>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.qtyButton} onPress={() => decreaseQuantity(item.id)}>
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity style={styles.qtyButton} onPress={() => increaseQuantity(item.id)}>
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60, paddingHorizontal: 20 },
  headerText: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 20 },
  emptyText: { color: colors.textSecondary, fontSize: 16, marginTop: 40, textAlign: 'center' },
  backButton: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, marginTop: 24, alignItems: 'center' },
  backButtonText: { color: colors.surface, fontWeight: '600' },
  listContent: { gap: 12, paddingBottom: 20 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemInfo: { flex: 1 },
  itemName: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  itemRestaurant: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  itemPrice: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  quantityControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyButton: {
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: { color: colors.surface, fontSize: 18, fontWeight: 'bold' },
  qtyText: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', minWidth: 20, textAlign: 'center' },
  footer: { borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 20 },
  totalText: { color: colors.textPrimary, fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  clearButton: { backgroundColor: colors.outOfStock, padding: 14, borderRadius: 10, alignItems: 'center' },
  clearButtonText: { color: colors.surface, fontWeight: '600' },
});