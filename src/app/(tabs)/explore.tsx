import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../firebaseConfig';
import { colors } from '@/constants/colors';
import { useCart } from '@/context/cart-context';

export default function ProfileScreen() {
  const { clearCart } = useCart();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            clearCart();
            await signOut(auth);
            router.replace('/welcome');
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Profile</Text>

      <View style={styles.infoCard}>
        <Ionicons name="person-circle-outline" size={48} color={colors.primary} />
        <View style={styles.infoTextWrapper}>
          <Text style={styles.emailText}>{auth.currentUser?.email}</Text>
          <Text style={styles.statusText}>
            {auth.currentUser?.emailVerified ? 'Verified account' : 'Unverified'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.surface} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 28,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 28,
    gap: 14,
  },
  infoTextWrapper: {
    flex: 1,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
  },
  logoutText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});