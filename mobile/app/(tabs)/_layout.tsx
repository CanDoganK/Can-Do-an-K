import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: { backgroundColor: Colors.card, borderTopColor: Colors.cardBorder },
        headerStyle: { backgroundColor: Colors.card },
        headerTintColor: Colors.text,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Durum',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'server.rack', android: 'dns', web: 'dns' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'Haberler',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'megaphone', android: 'campaign', web: 'campaign' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'person.crop.circle', android: 'person', web: 'person' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Rehber',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'book', android: 'menu_book', web: 'menu_book' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}
