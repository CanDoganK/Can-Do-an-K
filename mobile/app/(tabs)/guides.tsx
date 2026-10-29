import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Body, Card, Muted, Title } from '@/components/ui';
import Colors from '@/constants/Colors';
import { LINKS } from '@/src/config';
import { GUIDES } from '@/src/data/guides';

export default function GuidesScreen() {
  const [openId, setOpenId] = useState<string | null>(GUIDES[0]?.id ?? null);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Muted style={styles.section}>BAĞLANTILAR</Muted>
      {LINKS.map((link) => (
        <Pressable key={link.url} onPress={() => WebBrowser.openBrowserAsync(link.url)}>
          {({ pressed }) => (
            <Card style={[styles.linkCard, { opacity: pressed ? 0.7 : 1 }]}>
              <View style={{ flex: 1 }}>
                <Title>{link.title}</Title>
                <Muted>{link.description}</Muted>
              </View>
              <Title style={{ color: Colors.tint }}>›</Title>
            </Card>
          )}
        </Pressable>
      ))}

      <Muted style={styles.section}>REHBERLER</Muted>
      {GUIDES.map((guide) => {
        const open = openId === guide.id;
        return (
          <Pressable key={guide.id} onPress={() => setOpenId(open ? null : guide.id)}>
            <Card>
              <View style={styles.guideHeader}>
                <Title style={{ flex: 1 }}>{guide.title}</Title>
                <Title style={{ color: Colors.tint }}>{open ? '−' : '+'}</Title>
              </View>
              {open &&
                guide.steps.map((step, i) => (
                  <View key={i} style={styles.step}>
                    <Muted style={styles.stepNo}>{i + 1}.</Muted>
                    <Body style={{ flex: 1 }}>{step}</Body>
                  </View>
                ))}
            </Card>
          </Pressable>
        );
      })}

      <Muted style={styles.disclaimer}>
        Bu uygulama topluluk tarafından hazırlanmıştır; Mojang veya Microsoft ile bağlantılı değildir.
      </Muted>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 12 },
  section: { marginTop: 8, fontWeight: '700', letterSpacing: 1 },
  linkCard: { flexDirection: 'row', alignItems: 'center' },
  guideHeader: { flexDirection: 'row', alignItems: 'center' },
  step: { flexDirection: 'row', gap: 8 },
  stepNo: { width: 20, fontSize: 15, lineHeight: 22 },
  disclaimer: { textAlign: 'center', marginTop: 12 },
});
