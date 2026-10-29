import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

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
      <Card style={styles.header}>
        {status?.iconDataUri ? (
          <Image source={{ uri: status.iconDataUri }} style={styles.icon} />
        ) : (
          <View style={[styles.icon, styles.iconPlaceholder]} />
        )}
        <View style={{ flex: 1, gap: 4 }}>
          <Title>{SERVER.name}</Title>
          <Pressable onPress={copyAddress}>
            <Muted>{copied ? 'Adres kopyalandı ✓' : `${SERVER.address}  ·  kopyalamak için dokun`}</Muted>
          </Pressable>
        </View>
      </Card>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 56, height: 56, borderRadius: 8 },
  iconPlaceholder: { backgroundColor: Colors.cardBorder },
  players: { fontSize: 32 },
  bar: { height: 8, borderRadius: 4, backgroundColor: Colors.cardBorder, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: Colors.tint },
  footer: { textAlign: 'center' },
});
