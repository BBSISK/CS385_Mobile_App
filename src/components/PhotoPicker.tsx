// src/components/PhotoPicker.tsx
import * as ImagePicker from 'expo-image-picker';
import { View } from 'react-native';
import { Button, HelperText, IconButton, useTheme } from 'react-native-paper';
import ItemImage from './ItemImage';

type Props = {
  photos: string[];
  onChange: (photos: string[]) => void;
  max: number;
  error?: string;
};

/**
 * Up to `max` photos from the gallery or camera, shown as thumbnails with a remove button.
 * Asks for permission first; if the student says no, nothing happens and they can still list
 * the item without photos.
 */
export default function PhotoPicker({ photos, onChange, max, error }: Props) {
  const theme = useTheme();
  const remaining = max - photos.length;

  async function fromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.7, // smaller files upload faster later
    });
    if (!result.canceled) {
      onChange([...photos, ...result.assets.map((a) => a.uri)].slice(0, max));
    }
  }

  async function fromCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled) onChange([...photos, result.assets[0].uri].slice(0, max));
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        {photos.map((uri, i) => (
          <View
            key={uri}
            style={{
              width: 96,
              height: 96,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: theme.colors.secondaryContainer,
            }}
          >
            <ItemImage uri={uri} label={`Photo ${i + 1}`} iconSize={32} />
            <IconButton
              icon="close"
              size={14}
              mode="contained"
              containerColor="#fff"
              accessibilityLabel={`Remove photo ${i + 1}`}
              onPress={() => onChange(photos.filter((p) => p !== uri))}
              style={{ position: 'absolute', top: 0, right: 0 }}
            />
          </View>
        ))}
      </View>

      {remaining > 0 && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: photos.length ? 12 : 0 }}>
          <Button mode="outlined" icon="image-multiple" onPress={fromGallery}>
            Add photos
          </Button>
          <Button mode="outlined" icon="camera" onPress={fromCamera}>
            Take photo
          </Button>
        </View>
      )}
      <HelperText type={error ? 'error' : 'info'} visible>
        {error ?? `${photos.length} of ${max} photos (optional for now)`}
      </HelperText>
    </View>
  );
}
