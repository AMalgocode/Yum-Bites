import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#FCEFDA',
  primary: '#D62A0C',
  hat: '#F29A1F',
  text: '#4B4F58',
  white: '#FFFFFF',
};

// Small decorative dots (tomatoes, herbs, spices)
const DOTS = [
  { top: 70, left: 38, size: 26, color: '#D62A0C' },
  { top: 118, left: 22, size: 28, color: '#D62A0C' },
  { top: 96, left: 80, size: 8, color: '#2E7D32' },
  { top: 66, right: 100, size: 14, color: '#9CB830' },
  { top: 330, left: 30, size: 10, color: '#E8641E' },
  { top: 372, left: 54, size: 8, color: '#3A3A3A' },
  { top: 356, right: 30, size: 8, color: '#E8641E' },
];

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        {DOTS.map((d, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { top: d.top, left: d.left, right: d.right, width: d.size, height: d.size, borderRadius: d.size / 2, backgroundColor: d.color },
            ]}
          />
        ))}

        {/* Logo and tagline */}
        <View style={styles.hero}>
          <MaterialCommunityIcons name="chef-hat" size={92} color={COLORS.hat} />
          <Text style={styles.logo}>YummyBites</Text>
          <Text style={styles.food}>FOOD</Text>
          <Text style={styles.tagline}>Order Smart. Eat Fresh.{'\n'}Skip the Wait.</Text>
        </View>

        {/* Plate. Swap the emoji for your real photo later (see the note below). */}
        <View style={styles.plate}>
          <Text style={styles.plateEmoji}>🍝</Text>
        </View>

        {/* Get Started */}
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  screen: { flex: 1, overflow: 'hidden' },
  dot: { position: 'absolute' },

  hero: { alignItems: 'center', marginTop: 90 },
  logo: {
    fontSize: 50,
    fontWeight: '800',
    fontStyle: 'italic',
    color: COLORS.primary,
    marginTop: 6,
  },
  food: { fontSize: 24, letterSpacing: 8, fontWeight: '700', color: COLORS.primary, marginTop: 2 },
  tagline: { fontSize: 20, color: COLORS.text, textAlign: 'center', lineHeight: 30, marginTop: 28 },

  plate: {
    position: 'absolute',
    right: -90,
    bottom: 70,
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor: '#FBF8F2',
    borderWidth: 3,
    borderColor: '#EFE6D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateEmoji: { fontSize: 150, marginRight: 50 },

  button: {
    position: 'absolute',
    left: 50,
    right: 50,
    bottom: 36,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonText: { color: COLORS.white, fontSize: 22, fontWeight: '700' },
});