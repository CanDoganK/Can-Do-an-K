import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Switch, View } from 'react-native';

import { Body, Card, Muted, Title } from '@/components/ui';
import Colors from '@/constants/Colors';
import { getPrefs, savePrefs, type NotificationPrefs } from '@/src/notifications';

const OPTIONS: { key: keyof NotificationPrefs; label: string; hint: string }[] = [
  { key: 'serverStatus', label: 'Sunucu açılınca / kapanınca', hint: 'Durum değiştiğinde haber ver' },
  { key: 'news', label: 'Yeni duyurular', hint: 'Yeni haber yayınlandığında haber ver' },
];

export function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPrefs().then(setPrefs);
  }, []);

  if (Platform.OS === 'web' || !prefs) return null;

  const toggle = async (key: keyof NotificationPrefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setSaving(true);
    try {
      if (await savePrefs(next)) {
        setPrefs(next);
      } else {
        Alert.alert('Bildirim izni gerekli', 'Bildirimleri açmak için telefon ayarlarından izin verin.');
      }
    } catch (e) {
      Alert.alert('Bildirimler ayarlanamadı', e instanceof Error ? e.message : 'Bilinmeyen hata');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <Title>Bildirimler</Title>
      {OPTIONS.map(({ key, label, hint }) => (
        <View key={key} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Body>{label}</Body>
            <Muted>{hint}</Muted>
          </View>
          <Switch
            value={prefs[key]}
            disabled={saving}
            onValueChange={(v) => toggle(key, v)}
            trackColor={{ true: Colors.tint, false: Colors.cardBorder }}
          />
        </View>
      ))}
      <Muted>Kontroller arka planda yapılır; telefonunuz sıklığı belirler (en sık 15 dakikada bir).</Muted>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
});
