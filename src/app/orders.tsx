import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#FBF5EA',
  primary: '#D63A1A',
  title: '#3A1F14',
  text: '#2E3440',
  muted: '#6B7280',
  card: '#FFFDF9',
  divider: '#EFE8DA',
  chip: '#F8EBD7',
  white: '#FFFFFF',
};

type Status = 'Preparing' | 'Completed' | 'Cancelled';
type Filter = 'All' | 'Completed' | 'Cancelled';

// Placeholder orders. We can load these from Firebase later.
const ORDERS = [
  { id: 'YB12345678', place: 'Food Court, CCD', date: '10 May, 12:30 PM', total: 130, status: 'Preparing' as Status },
  { id: 'YB12340091', place: 'Panda Junction', date: '08 May, 03:20 PM', total: 250, status: 'Completed' as Status },
  { id: 'YB12335551', place: 'Nescafé', date: '05 May, 06:30 PM', total: 180, status: 'Completed' as Status },
  { id: 'YB12339022', place: 'Food Court', date: '02 May, 12:00 PM', total: 230, status: 'Cancelled' as Status },
];

const STATUS_STYLES: Record<Status, { bg: string; color: string }> = {
  Preparing: { bg: '#FDE6BE', color: '#C2570C' },
  Completed: { bg: '#D9EFD3', color: '#2E7D32' },
  Cancelled: { bg: '#FADBD5', color: '#D32F2F' },
};

const FILTERS: Filter[] = ['All', 'Completed', 'Cancelled'];

export default function OrdersScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('All');

  const visibleOrders = ORDERS.filter((o) => filter === 'All' || o.status === filter);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={COLORS.title} />
        </Pressable>
        <Text style={styles.title}>My Orders</Text>
      </View>

      {/* Filter chips */}
      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Orders list */}
      <FlatList
        data={visibleOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No orders here yet.</Text>}
        renderItem={({ item }) => {
          const badge = STATUS_STYLES[item.status];
          return (
            <Pressable
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
              onPress={() => router.push('/order-details')}>
              <View style={styles.cardTop}>
                <Text style={styles.orderId}>{item.id}</Text>
                <Text style={styles.amount}>₹{item.total}</Text>
              </View>
              <View style={styles.cardBottom}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.place}>{item.place}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.color }]}>{item.status}</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 18,
  },
  backButton: { marginRight: 24 },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.title },

  filters: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 18 },
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: COLORS.chip,
  },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 16, color: COLORS.title, fontWeight: '500' },
  chipTextActive: { color: COLORS.white, fontWeight: '700' },

  list: { paddingHorizontal: 20, paddingBottom: 30 },
  empty: { textAlign: 'center', color: COLORS.muted, marginTop: 40, fontSize: 16 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 20, fontWeight: '800', color: COLORS.title },
  amount: { fontSize: 20, fontWeight: '700', color: COLORS.title },
  cardBottom: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 },
  place: { fontSize: 17, color: COLORS.muted, marginBottom: 6 },
  date: { fontSize: 16, color: COLORS.muted },
  badge: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  badgeText: { fontSize: 16, fontWeight: '700' },
});