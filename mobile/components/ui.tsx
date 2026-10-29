import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, type TextProps, type ViewProps } from 'react-native';

import Colors from '@/constants/Colors';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

export function Title({ style, ...props }: TextProps) {
  return <Text style={[styles.title, style]} {...props} />;
}

export function Body({ style, ...props }: TextProps) {
  return <Text style={[styles.body, style]} {...props} />;
}

export function Muted({ style, ...props }: TextProps) {
  return <Text style={[styles.muted, style]} {...props} />;
}

export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={Colors.tint} />
    </View>
  );
}

export function ErrorBox({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <Card style={{ borderColor: Colors.offline }}>
      <Body>{message}</Body>
      {action}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  title: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  body: { color: Colors.text, fontSize: 15, lineHeight: 22 },
  muted: { color: Colors.textMuted, fontSize: 13 },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  center: { padding: 32, alignItems: 'center' },
});
