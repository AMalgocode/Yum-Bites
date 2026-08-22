import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';

const foodCenters = [
  { id: 'ccd', name: 'CCD', fullName: 'Coffee Cafe Day', tagline: 'Fast food, coffee & tea varieties' },
  { id: 'nescafe', name: 'Nescafe', fullName: 'Nescafe Corner', tagline: 'Maggi, pasta, fried rice & more' },
  { id: 'canteen', name: 'Campus Canteen', fullName: 'Campus Canteen', tagline: 'Biryani, boiled egg & home-style food' },
];

export default function ChooseFoodCenter() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.welcomeText}>Welcome to Yum Bites</Text>
      <Text style={styles.subText}>Choose your food and have fun</Text>

      <View style={styles.cardsWrapper}>
        {foodCenters.map((center) => (
          <TouchableOpacity
            key={center.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/menu/[center]', params: { center: center.id } })}
            activeOpacity={0.8}
          >
            <View style={styles.cardIconCircle}>
              <Text style={styles.cardIconText}>{center.name.charAt(0)}</Text>
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardName}>{center.fullName}</Text>
              <Text style={styles.cardTagline}>{center.tagline}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 60 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, textAlign: 'center' },
  subText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 6, marginBottom: 32 },
  cardsWrapper: { gap: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIconText: { color: colors.surface, fontSize: 20, fontWeight: 'bold' },
  cardTextWrapper: { flex: 1 },
  cardName: { color: colors.textPrimary, fontSize: 17, fontWeight: '600' },
  cardTagline: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
});