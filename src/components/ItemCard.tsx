// src/components/ItemCard.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import ItemImage from './ItemImage';

type Props = { item: any; showLike?: boolean };

export default function ItemCard({ item, showLike = true }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  return (
    <Pressable
      style={{ width: '48%', marginBottom: 16 }}
      onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })}
    >
      <View
        style={{
          aspectRatio: 0.87,
          borderRadius: 28,
          backgroundColor: theme.colors.secondaryContainer,
          overflow: 'hidden', // clip the photo to the rounded corners
        }}
      >
        <ItemImage uri={item.image} label={item.title} />
        {showLike && (
          <IconButton
            icon={liked ? 'heart' : 'heart-outline'}
            mode="contained"
            containerColor="#fff"
            size={18}
            onPress={() => setLiked(!liked)}
            style={{ position: 'absolute', right: 6, bottom: 6 }}
          />
        )}
      </View>
      <Text variant="labelLarge" style={{ marginTop: 8, marginLeft: 12 }}>
        {item.title}
      </Text>
      <Text variant="labelLarge" style={{ marginLeft: 12 }}>
        {item.condition} · {item.size}
      </Text>
    </Pressable>
  );
}
