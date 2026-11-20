// src/components/ItemImage.tsx
import { Image } from 'expo-image';
import { View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';

type Props = {
  /** Photo URL. If missing, a placeholder icon is shown instead. */
  uri?: string;
  /** Describes the photo for screen readers, e.g. the item title. */
  label: string;
  /** Size of the placeholder icon. */
  iconSize?: number;
};

/**
 * An item's photo, filling its container (the container sets the size and rounded corners).
 * Falls back to the shape icon when an item has no photo yet, so new listings still look tidy.
 */
export default function ItemImage({ uri, label, iconSize = 64 }: Props) {
  const theme = useTheme();

  if (!uri) {
    return (
      <View
        accessibilityLabel={`${label} (no photo)`}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Icon source="shape-outline" size={iconSize} color={theme.colors.outline} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      accessibilityLabel={label}
      contentFit="cover"
      transition={200}
      // Remote photos load over the network, so keep a copy on the phone after the first load.
      cachePolicy="memory-disk"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
