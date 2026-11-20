// src/components/ItemImage.tsx
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
 * Shows the shape icon when an item has no photo, or when the photo fails to load
 * (e.g. no internet), so a card is never left blank.
 */
export default function ItemImage({ uri, label, iconSize = 64 }: Props) {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <View
        accessibilityLabel={`${label} (no photo)`}
        style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}
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
      onError={() => setFailed(true)}
      // absoluteFill fills the parent on every platform; percentage sizes inside an
      // aspectRatio container aren't reliable on all phones.
      style={StyleSheet.absoluteFill}
    />
  );
}
