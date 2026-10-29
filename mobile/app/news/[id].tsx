import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Badge, Body, ErrorBox, Loading, Muted, Title } from '@/components/ui';
import Colors from '@/constants/Colors';
import { fetchNewsItem, type NewsItem } from '@/src/api/news';
import { formatDate, TAG_COLORS } from '@/src/format';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<NewsItem | null | undefined>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsItem(id)
      .then(setItem)
      .catch((e) => setError(e instanceof Error ? e.message : 'Bilinmeyen hata'));
  }, [id]);

  if (error) return <ErrorBox message={error} />;
  if (item === null) return <Loading />;
  if (item === undefined) return <ErrorBox message="Duyuru bulunamadı." />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: item.tag }} />
      <Badge label={item.tag} color={TAG_COLORS[item.tag]} />
      <Title style={styles.title}>{item.title}</Title>
      {item.date && <Muted>{formatDate(item.date)}</Muted>}
      <Body>{item.body}</Body>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 24 },
});
