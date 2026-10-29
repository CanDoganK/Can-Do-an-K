import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Body, Title } from '@/components/ui';
import Colors from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Bulunamadı' }} />
      <View style={styles.container}>
        <Title>Bu sayfa mevcut değil.</Title>
        <Link href="/" style={styles.link}>
          <Body style={{ color: Colors.tint }}>Ana sayfaya dön</Body>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  link: { marginTop: 15, paddingVertical: 15 },
});
