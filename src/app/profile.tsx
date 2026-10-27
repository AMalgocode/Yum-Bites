import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { clearSession } from '@/lib/session';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#FBF5EA',
  primary: '#C73E1D',
  title: '#3A1F14',
  text: '#2E3440',
  muted: '#6B7280',
  card: '#FFFDF9',
  divider: '#EFE8DA',
  white: '#FFFFFF',
};

const MENU = [
  { key: 'edit', label: 'Edit Profile', icon: 'person-outline' },
  { key: 'history', label: 'Order History', icon: 'time-outline' },
  { key: 'addresses', label: 'Addresses', icon: 'location-outline' },
  { key: 'payment', label: 'Payment Methods', icon: 'card-outline' },
  { key: 'help', label: 'Help & Support', icon: 'help-buoy-outline' },
] as const;

export default function ProfileScreen() {
  const router = useRouter();

  // Placeholder user details. We can connect these to Firebase later.
  const user = {
    name: 'Student User',
    email: 'student123@college.com',
    phone: '+91 98765 43210',
  };

 const handleLogout = async () => {
  await clearSession();
  await signOut(auth);
};
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSide} />
          <Text style={styles.title}>My Profile</Text>
          <Pressable style={styles.headerSide} hitSlop={10}>
            <Ionicons name="settings-outline" size={26} color={COLORS.text} />
          </Pressable>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={COLORS.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.contact}>{user.email}</Text>
            <Text style={styles.contact}>{user.phone}</Text>
          </View>
          <Ionicons
            name="restaurant-outline"
            size={44}
            color="rgba(255,255,255,0.35)"
            style={styles.cardDecoration}
          />
        </View>

        {/* Menu list */}
        <View style={styles.menuCard}>
          {MENU.map((item) => (
            <Pressable
              key={item.key}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => {
                // TODO: navigate to each page when it exists
              }}>
              <Ionicons name={item.icon} size={26} color={COLORS.text} />
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
            </Pressable>
          ))}

          <Pressable
            style={({ pressed }) => [styles.row, styles.lastRow, pressed && styles.rowPressed]}
            onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={26} color={COLORS.primary} />
            <Text style={[styles.rowLabel, styles.logoutLabel]}>Logout</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
          </Pressable>
        </View>
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
  headerSide: { width: 30, alignItems: 'flex-end' },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.title },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FCE9D2',
    borderWidth: 3,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { flex: 1, marginLeft: 16 },
  name: { fontSize: 22, fontWeight: '700', color: COLORS.white, marginBottom: 6 },
  contact: { fontSize: 14, color: '#FFD9CC', marginBottom: 2 },
  cardDecoration: { position: 'absolute', right: 14, top: 14 },

  menuCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  lastRow: { borderBottomWidth: 0 },
  rowPressed: { opacity: 0.6 },
  rowLabel: { flex: 1, marginLeft: 16, fontSize: 17, color: COLORS.text },
  logoutLabel: { color: COLORS.primary, fontWeight: '600' },
});