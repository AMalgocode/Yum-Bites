import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'loginTimestamp';
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export async function markLogin() {
  await AsyncStorage.setItem(KEY, String(Date.now()));
}

// True if the login is still within 7 days.
// If there is no saved time (someone already logged in before this update), start the 7 days now.
export async function checkSession() {
  const saved = await AsyncStorage.getItem(KEY);
  if (!saved) {
    await markLogin();
    return true;
  }
  return Date.now() - Number(saved) < SEVEN_DAYS;
}

export async function clearSession() {
  await AsyncStorage.removeItem(KEY);
}