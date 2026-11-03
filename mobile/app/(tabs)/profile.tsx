import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Body, Card, ErrorBox, Muted, Title } from '@/components/ui';
import Colors from '@/constants/Colors';
import {
  avatarUrl,
  bodyUrl,
  fetchConCityStats,
  fetchMojangProfile,
  type ConCityStats,
  type MojangProfile,
} from '@/src/api/player';
import { addRecentSearch, getMyUsername, getRecentSearches, setMyUsername } from '@/src/storage';

type Result = { profile: MojangProfile; stats: ConCityStats | null };

const STAT_LABELS: { key: keyof ConCityStats; label: string }[] = [
  { key: 'rank', label: 'Rütbe' },
  { key: 'islandLevel', label: 'Ada seviyesi' },
  { key: 'balance', label: 'Bakiye' },
  { key: 'kills', label: 'Öldürme' },
  { key: 'playTimeHours', label: 'Oynama süresi (saat)' },
];

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [myName, setMyName] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  // Kayıtlı hesap varsa sekme açılınca onu göster.
  useEffect(() => {
    getRecentSearches().then(setRecent);
    getMyUsername().then((saved) => {
      setMyName(saved);
      if (saved) search(saved);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMyAccount = async (name: string) => {
    const next = myName?.toLowerCase() === name.toLowerCase() ? null : name;
    await setMyUsername(next);
    setMyName(next);
  };

  const search = async (override?: string) => {
    const name = (override ?? username).trim();
    setUsername(name);
    if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) {
      setError('Geçerli bir Minecraft kullanıcı adı girin (3–16 karakter, harf/rakam/_).');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const profile = await fetchMojangProfile(name);
      if (!profile) {
        setError(`"${name}" adında bir Minecraft hesabı bulunamadı.`);
        return;
      }
      setResult({ profile, stats: await fetchConCityStats(profile.id) });
      setRecent(await addRecentSearch(profile.name));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const isMine = (r: Result) => myName?.toLowerCase() === r.profile.name.toLowerCase();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Minecraft kullanıcı adı"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
          onSubmitEditing={() => search()}
          returnKeyType="search"
        />
        <Pressable style={styles.button} onPress={() => search()} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Ara</Text>}
        </Pressable>
      </View>

      {recent.length > 0 && (
        <View style={styles.recentRow}>
          {recent.map((name) => (
            <Pressable key={name} style={styles.recentChip} onPress={() => search(name)} disabled={loading}>
              <Image source={{ uri: avatarUrl(name, 32) }} style={styles.recentHead} />
              <Text style={styles.recentText}>{name}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {error && <ErrorBox message={error} />}

      {result && (
        <>
          <Card style={styles.profileCard}>
            <Image source={{ uri: bodyUrl(result.profile.id) }} style={styles.body} resizeMode="contain" />
            <View style={{ flex: 1, gap: 6 }}>
              <View style={styles.nameRow}>
                <Image source={{ uri: avatarUrl(result.profile.id, 32) }} style={styles.avatar} />
                <Title>{result.profile.name}</Title>
              </View>
              <Muted selectable>{result.profile.id}</Muted>
              <Pressable
                style={[styles.mineButton, isMine(result) && styles.mineButtonActive]}
                onPress={() => toggleMyAccount(result.profile.name)}>
                <Text style={[styles.mineText, isMine(result) && styles.mineTextActive]}>
                  {isMine(result) ? '★ Hesabım' : '☆ Bu benim hesabım'}
                </Text>
              </Pressable>
            </View>
          </Card>

          <Card>
            <Title>ConCity istatistikleri</Title>
            {result.stats ? (
              STAT_LABELS.filter(({ key }) => result.stats?.[key] !== undefined).map(({ key, label }) => (
                <View key={key} style={styles.statRow}>
                  <Muted>{label}</Muted>
                  <Body>{String(result.stats?.[key])}</Body>
                </View>
              ))
            ) : (
              <Body>
                İstatistikler yakında! Sunucu ekibiyle API entegrasyonu tamamlandığında ada seviyesi,
                bakiye ve sıralamalar burada görünecek.
              </Body>
            )}
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 12 },
  searchRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.tint,
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    minWidth: 64,
    alignItems: 'center',
  },
  buttonText: { color: '#000', fontWeight: '700', fontSize: 16 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  body: { width: 80, height: 160 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 24, height: 24, borderRadius: 4 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  recentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  recentHead: { width: 18, height: 18, borderRadius: 3 },
  recentText: { color: Colors.text, fontSize: 13 },
  mineButton: {
    alignSelf: 'flex-start',
    borderColor: Colors.tint,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
  },
  mineButtonActive: { backgroundColor: Colors.tint },
  mineText: { color: Colors.tint, fontWeight: '600', fontSize: 13 },
  mineTextActive: { color: '#000' },
});
