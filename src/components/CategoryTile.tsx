// src/components/CategoryTile.tsx
import { Pressable, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ItemImage from './ItemImage';

type Props = {
  label: string;
  /** Photo for the category. Without one, the tile shows the placeholder icon. */
  image?: string;
  onPress?: () => void;
};

/** A Browse tile: a photo of the category with its name underneath. */
export default function CategoryTile({ label, image, onPress }: Props) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Browse ${label}`}
      style={{ width: '48%', marginBottom: 16 }}
    >
      <View
        style={{
          height: 100,
          borderRadius: 28,
          backgroundColor: theme.colors.secondaryContainer,
          overflow: 'hidden', // clip the photo to the rounded corners
        }}
      >
        <ItemImage uri={image} label={label} iconSize={44} />
      </View>
      <Text variant="labelLarge" style={{ marginTop: 8, marginLeft: 12 }}>
        {label}
      </Text>
    </Pressable>
  );
}
