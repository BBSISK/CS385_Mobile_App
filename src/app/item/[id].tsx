// src/app/item/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Divider, IconButton, Snackbar, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CarbonImpact from '../../components/CarbonImpact';
import ItemImage from '../../components/ItemImage';
import { items } from '../../constants/mockData';

export default function ItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState(false);
  const [requested, setRequested] = useState(false);

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Item not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />

        <View
          style={{
            height: 320,
            marginHorizontal: 16,
            borderRadius: 28,
            backgroundColor: theme.colors.secondaryContainer,
            overflow: 'hidden', // clip the photo to the rounded corners
          }}
        >
          <ItemImage uri={item.image} label={item.title} iconSize={96} />
          <IconButton
            icon={liked ? 'heart' : 'heart-outline'}
            mode="contained"
            containerColor="#fff"
            onPress={() => setLiked(!liked)}
            style={{ position: 'absolute', right: 8, bottom: 8 }}
          />
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Text variant="titleLarge">{item.title}</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
            {item.condition} · {item.size} · Uploaded {item.uploaded}
          </Text>

          <View style={{ marginTop: 16 }}>
            <CarbonImpact subcategory={item.subcategory} />
          </View>

          <Divider style={{ marginVertical: 16 }} />

          <Text variant="titleSmall">Description</Text>
          <Text variant="bodyMedium" style={{ marginTop: 4 }}>
            {item.description}
          </Text>

          <Divider style={{ marginVertical: 16 }} />

          <Text variant="titleSmall">Preferred pick up</Text>
          <Text variant="bodyMedium" style={{ marginTop: 4 }}>
            {item.pickup}
          </Text>
        </View>
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 12, padding: 16 }}>
        <Button mode="contained" style={{ flex: 2 }} onPress={() => setRequested(true)}>
          Request
        </Button>
        <Button mode="contained-tonal" style={{ flex: 1 }} onPress={() => setLiked(!liked)}>
          {liked ? 'Liked' : 'Like'}
        </Button>
      </View>

      <Snackbar visible={requested} onDismiss={() => setRequested(false)} duration={2500}>
        Request sent
      </Snackbar>
    </View>
  );
}
