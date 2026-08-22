import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useCart } from '@/context/cart-context';
import { colors } from '@/constants/colors';

type MenuItem = { id: string; name: string; price: number };

const menus: Record<string, { restaurantName: string; items: MenuItem[] }> = {
  ccd: {
    restaurantName: 'CCD - Coffee Cafe Day',
    items: [
      { id: 'ccd-1', name: 'Patties', price: 30 },
      { id: 'ccd-2', name: 'Coffee (Regular)', price: 25 },
      { id: 'ccd-3', name: 'Coffee (Special)', price: 40 },
      { id: 'ccd-4', name: 'Tea (Regular)', price: 15 },
      { id: 'ccd-5', name: 'Tea (Masala)', price: 20 },
    ],
  },
  nescafe: {
    restaurantName: 'Nescafe Corner',
    items: [
      { id: 'nes-1', name: 'Maggi', price: 40 },
      { id: 'nes-2', name: 'Pasta', price: 60 },
      { id: 'nes-3', name: 'Egg Fried Rice', price: 70 },
      { id: 'nes-4', name: 'Chicken Fried Rice', price: 90 },
      { id: 'nes-5', name: 'Manchurian', price: 65 },
    ],
  },
  canteen: {
    restaurantName: 'Campus Canteen',
    items: [
      { id: 'can-1', name: 'Biryani', price: 80 },
      { id: 'can-2', name: 'Boiled Egg', price: 10 },
      { id: 'can-3', name: 'Bread', price: 15 },
      { id: 'can-4', name: 'Chai', price: 15 },
    ],
  },
};

export default function MenuScreen() {
  const { center } = useLocalSearchParams<{ center: string }>();
  const data = menus[center as string];
  const { addToCart, totalItems } = useCart();

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Menu not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>{data.restaurantName}</Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cart')}>
          <Text style={styles.cartButtonText}>Cart ({totalItems})</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                addToCart({ id: item.id, name: item.name, price: item.price, restaurantName: data.restaurantName })
              }
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerText: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, flex: 1 },
  cartButton: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  cartButtonText: { color: colors.surface, fontWeight: '600', fontSize: 13 },
  listContent: { gap: 12, paddingBottom: 40 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemInfo: { flex: 1 },
  itemText: { color: colors.textPrimary, fontSize: 16 },
  itemPrice: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  addButton: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: colors.surface, fontWeight: '600' },
});