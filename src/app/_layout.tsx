// src/app/_layout.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { PaperProvider, useTheme } from 'react-native-paper';
import { paperTheme } from '../constants/paperTheme';

const tabs = [
  { name: 'index', title: 'Home', icon: 'home-outline' },
  { name: 'browse', title: 'Browse', icon: 'dots-grid' },
  { name: 'list', title: 'List', icon: 'plus-box-outline' },
  { name: 'wardrobe', title: 'Wardrobe', icon: 'briefcase-outline' },
  { name: 'profile', title: 'Profile', icon: 'chart-box-outline' },
] as const;

function TabsLayout() {
  const t = useTheme();

  return (
    <Tabs
      // "history" makes the back button return to the previous screen (e.g. a category list)
      // instead of always jumping to the first tab.
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.primary,
        tabBarStyle: { backgroundColor: t.colors.elevation.level2 },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            // The tab bar always passes a plain colour string; SDK 58's wider type allows null.
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name={tab.icon} color={color as string} size={size} />
            ),
          }}
        />
      ))}
      {/*
        Item detail and category lists are reached from cards, not from the tab bar.
        Hide only their tab button: `href: null` would hide the button but also make the
        route unreachable, so tapping a card did nothing.
      */}
      <Tabs.Screen
        name="item/[id]"
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="category/[name]"
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider theme={paperTheme}>
      <TabsLayout />
    </PaperProvider>
  );
}
