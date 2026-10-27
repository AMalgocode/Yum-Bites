import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../../firebaseConfig';

const COLORS = {
  background: '#FEF6EA',
  card: '#FCE4C4',
  primary: '#D62A0C',
  title: '#2A1710',
  text: '#3F3A36',
  plate: '#FFFBF4',
  white: '#FFFFFF',
};

// Change the ids if your menu page (menu/[center].tsx) expects different values.
const CENTERS = [
  { id: 'food-court', name: 'Food Court', tagline: 'Fresh meals for your campus day.', emoji: '🍛' },
  { id: 'ccd', name: 'CCD', tagline: 'Coffee that makes your day better.', emoji: '☕' },
  { id: 'panda-junction', name: 'Panda Junction', tagline: 'Snacks & quick bites for you.', emoji: '🥯' },
  { id: 'nescafe', name: 'Nescafé', tagline: 'Pasta, Momos & more delicious bites.', emoji: '🍝' },
];

export default function HomeScreen() {
  const router = useRouter();

  // Uses the name saved at sign-up. Falls back to "Student".
  const firstName = auth.currentUser?.displayName?.trim().split(' ')[0] || 'Student';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable hitSlop={10} onPress={() => Alert.alert('Menu', 'Side menu is not set up yet.')}>
            <Ionicons name="menu" size={34} color={COLORS.title} />
          </Pressable>
          <Pressable hitSlop={10} onPress={() => Alert.alert('Notifications', 'No new notifications.')}>
            <Ionicons name="notifications-outline" size={30} color={COLORS.title} />
          </Pressable>
        </View>

        <Text style={styles.hello}>Hello, {firstName} 👋</Text>
        <Text style={styles.question}>What would you like to eat?</Text>

        {/* Food centers */}
        {CENTERS.map((c) => (
          <Pressable
            key={c.id}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
            onPress={() => router.push({ pathname: '/menu/[center]', params: { center: c.id } })}>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{c.name}</Text>
              <Text style={styles.cardTagline}>{c.tagline}</Text>
            </View>

            <View style={styles.plate}>
              <Text style={styles.emoji}>{c.emoji}</Text>
            </View>

            <View style={styles.arrow}>
              <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 18, paddingBottom: 120 },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 22 },

  hello: { fontSize: 28, fontWeight: '800', color: COLORS.title },
  question: { fontSize: 20, color: COLORS.text, marginTop: 6, marginBottom: 22 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 26,
    height: 150,
    paddingLeft: 24,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardText: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: 25, fontWeight: '800', color: COLORS.title, marginBottom: 8 },
  cardTagline: { fontSize: 17, color: COLORS.text, lineHeight: 25 },

  plate: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.plate,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -14,
  },
  emoji: { fontSize: 70 },

  arrow: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});