import AsyncStorage from '@react-native-async-storage/async-storage';

// Profil sekmesinin hatırladığı bilgiler. Depolama kullanılamazsa
// (ör. gizli sekme) sessizce varsayılana döner.
const MY_NAME_KEY = 'profile/myUsername';
const RECENT_KEY = 'profile/recentSearches';
const MAX_RECENT = 5;

export async function getMyUsername(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(MY_NAME_KEY);
  } catch {
    return null;
  }
}

export async function setMyUsername(name: string | null) {
  try {
    if (name) await AsyncStorage.setItem(MY_NAME_KEY, name);
    else await AsyncStorage.removeItem(MY_NAME_KEY);
  } catch {}
}

export async function getRecentSearches(): Promise<string[]> {
  try {
    return JSON.parse((await AsyncStorage.getItem(RECENT_KEY)) ?? '[]');
  } catch {
    return [];
  }
}

export async function addRecentSearch(name: string): Promise<string[]> {
  const next = [name, ...(await getRecentSearches()).filter((n) => n.toLowerCase() !== name.toLowerCase())].slice(
    0,
    MAX_RECENT
  );
  try {
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
  return next;
}
