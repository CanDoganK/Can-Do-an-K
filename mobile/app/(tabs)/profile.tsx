import { useState } from 'react';
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

  const search = async () => {
    const name = username.trim();
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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

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
          onSubmitEditing={search}
          returnKeyType="search"
        />
        <Pressable style={styles.button} onPress={search} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Ara</Text>}
        </Pressable>
      </View>

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
});
