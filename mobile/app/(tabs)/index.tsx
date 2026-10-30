import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { NotificationSettings } from '@/components/NotificationSettings';
import { Badge, Body, Card, ErrorBox, Loading, Muted, Title } from '@/components/ui';
import Colors from '@/constants/Colors';
import { fetchServerStatus, type ServerStatus } from '@/src/api/status';
import { SERVER } from '@/src/config';

export default function StatusScreen() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setStatus(await fetchServerStatus());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bilinmeyen hata');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const copyAddress = async () => {
    await Clipboard.setStringAsync(SERVER.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.tint} />}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        <Pressable onPress={copyAddress} style={styles.address}>
          <Body style={styles.addressText}>{SERVER.address}</Body>
          <Muted>{copied ? 'Kopyalandı ✓' : 'Kopyalamak için dokun'}</Muted>
        </Pressable>
      </View>

      {!status && !error && <Loading />}
      {error && <ErrorBox message={`Sunucu durumu alınamadı: ${error}`} />}

      {status && (
        <>
          <Card>
            <Badge
              label={status.online ? 'Çevrimiçi' : 'Çevrimdışı'}
              color={status.online ? Colors.online : Colors.offline}
            />
            {status.online && (
              <>
                <Muted>Oyuncular</Muted>
                <Title style={styles.players}>
                  {status.playersOnline}
                  <Muted> / {status.playersMax}</Muted>
                </Title>
                <View style={styles.bar}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${Math.min(100, (status.playersOnline / Math.max(1, status.playersMax)) * 100)}%` },
                    ]}
                  />
                </View>
              </>
            )}
          </Card>

          {status.online && (
            <Card>
              {status.version && (
                <>
                  <Muted>Sürüm</Muted>
                  <Body>{status.version}</Body>
                </>
              )}
              {status.motd.length > 0 && (
                <>
                  <Muted>Mesaj (MOTD)</Muted>
                  {status.motd.map((line, i) => (
                    <Body key={i}>{line}</Body>
                  ))}
                </>
              )}
            </Card>
          )}

          <Muted style={styles.footer}>
            Son kontrol: {status.checkedAt.toLocaleTimeString('tr-TR')} · Yenilemek için aşağı çekin
          </Muted>
        </>
      )}

      <NotificationSettings />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 12 },
  header: { alignItems: 'center', gap: 12, paddingVertical: 8 },
  logo: { width: '85%', aspectRatio: 474 / 106 },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.card,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  addressText: { fontWeight: '700', color: Colors.tint },
  players: { fontSize: 32 },
  bar: { height: 8, borderRadius: 4, backgroundColor: Colors.cardBorder, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: Colors.tint },
  footer: { textAlign: 'center' },
});
