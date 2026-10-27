import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomizeSheet, { Customization } from '@/components/customize-sheet';
import { useCart } from '@/context/cart-context';

const COLORS = {
  background: '#FDF8EF',
  primary: '#D0300F',
  title: '#1F1510',
  muted: '#7A7F87',
  card: '#FFFDF9',
  divider: '#EFE8DA',
  white: '#FFFFFF',
};

// temp: true  -> asks Hot / Cold
// spice: true -> asks Less spicy / Medium / More spicy
// Items with neither are added straight to the cart.
type MenuItem = { id: string; name: string; price: number; temp?: boolean; spice?: boolean };

const menus: Record<string, { restaurantName: string; items: MenuItem[] }> = {
  ccd: {
    restaurantName: 'CCD - Coffee Cafe Day',
    items: [
      { id: 'ccd-1', name: 'Patties', price: 30, spice: true },
      { id: 'ccd-2', name: 'Coffee (Regular)', price: 25, temp: true },
      { id: 'ccd-3', name: 'Coffee (Special)', price: 40, temp: true },
      { id: 'ccd-4', name: 'Tea (Regular)', price: 15, temp: true },
      { id: 'ccd-5', name: 'Tea (Masala)', price: 20, temp: true },
    ],
  },
  nescafe: {
    restaurantName: 'Nescafe Corner',
    items: [
      { id: 'nes-1', name: 'Maggi', price: 40, spice: true },
      { id: 'nes-2', name: 'Pasta', price: 60, spice: true },
      { id: 'nes-3', name: 'Egg Fried Rice', price: 70, spice: true },
      { id: 'nes-4', name: 'Chicken Fried Rice', price: 90, spice: true },
      { id: 'nes-5', name: 'Manchurian', price: 65, spice: true },
    ],
  },
  canteen: {
    restaurantName: 'Campus Canteen',
    items: [
      { id: 'can-1', name: 'Biryani', price: 80, spice: true },
      { id: 'can-2', name: 'Boiled Egg', price: 10 },
      { id: 'can-3', name: 'Bread', price: 15 },
      { id: 'can-4', name: 'Chai', price: 15, temp: true },
    ],
  },
};

export default function MenuScreen() {
  const { center } = useLocalSearchParams<{ center: string }>();
  const data = menus[center as string];
  const { addToCart, totalItems } = useCart();

  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [toast, setToast] = useState('');

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={28} color={COLORS.title} />
        </Pressable>
        <Text style={styles.notFound}>Menu not found</Text>
      </SafeAreaView>
    );
  }

  const showToast = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(''), 1500);
  };

  const addItem = (item: MenuItem, choices: Customization = {}) => {
    const parts = [choices.temperature, choices.spice, choices.note].filter(Boolean) as string[];
    const suffix = parts.length ? ` · ${parts.join(' · ')}` : '';

    addToCart({
      // Different choices -> different id -> separate cart line
      id: parts.length ? `${item.id}|${parts.join('|')}` : item.id,
      name: item.name + suffix,
      price: item.price,
      restaurantName: data.restaurantName,
    });
    showToast(`${item.name} added`);
  };

  const handleAddPress = (item: MenuItem) => {
    if (item.temp || item.spice) {
      setSelected(item); // open the customize popup
    } else {
      addItem(item);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={28} color={COLORS.title} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{data.restaurantName}</Text>
        <Pressable style={styles.cartPill} onPress={() => router.push('/cart')}>
          <Ionicons name="cart-outline" size={18} color={COLORS.white} />
          <Text style={styles.cartPillText}>{totalItems}</Text>
        </Pressable>
      </View>

      <FlatList
        data={data.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              {(item.temp || item.spice) && <Text style={styles.customHint}>Customizable</Text>}
            </View>
            <Pressable
              style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.85 }]}
              onPress={() => handleAddPress(item)}>
              <Text style={styles.addText}>Add</Text>
            </Pressable>
          </View>
        )}
      />

      {!!toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      <CustomizeSheet
        visible={!!selected}
        itemName={selected?.name ?? ''}
        showTemperature={!!selected?.temp}
        showSpice={!!selected?.spice}
        onCancel={() => setSelected(null)}
        onConfirm={(choices) => {
          if (selected) addItem(selected, choices);
          setSelected(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  back: { padding: 20 },
  notFound: { fontSize: 18, color: COLORS.muted, textAlign: 'center', marginTop: 40 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 18 },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: COLORS.title },
  cartPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  cartPillText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },

  list: { paddingHorizontal: 20, paddingBottom: 40 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
    padding: 16,
    marginBottom: 12,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: '700', color: COLORS.title },
  itemPrice: { fontSize: 16, color: COLORS.muted, marginTop: 4 },
  customHint: { fontSize: 13, color: COLORS.primary, marginTop: 4, fontWeight: '600' },
  addButton: { backgroundColor: COLORS.primary, paddingHorizontal: 22, paddingVertical: 10, borderRadius: 12 },
  addText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },

  toast: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: COLORS.title, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 22 },
  toastText: { color: COLORS.white, fontSize: 15, fontWeight: '600' },
});