import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { Badge, Body, Card, ErrorBox, Loading, Muted, Title } from '@/components/ui';
import Colors from '@/constants/Colors';
import { fetchNews, type NewsItem } from '@/src/api/news';
import { formatDate, TAG_COLORS } from '@/src/format';

export default function NewsScreen() {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setItems(await fetchNews());
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

  if (error) {
    return (
      <View style={[styles.screen, styles.content]}>
        <ErrorBox message={error} onRetry={load} />
      </View>
    );
  }
  if (!items) return <Loading />;

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={[...items].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.tint} />}
      ListEmptyComponent={<Muted>Henüz duyuru yok.</Muted>}
      renderItem={({ item }) => (
        <Link href={{ pathname: '/news/[id]', params: { id: item.id } }} asChild>
          <Pressable>
            {({ pressed }) => (
              <Card style={{ opacity: pressed ? 0.7 : 1 }}>
                <Badge label={item.tag} color={TAG_COLORS[item.tag]} />
                <Title>{item.title}</Title>
                <Body>{item.summary}</Body>
                {item.date && <Muted>{formatDate(item.date)}</Muted>}
              </Card>
            )}
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 12 },
});
