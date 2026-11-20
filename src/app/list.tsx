// src/app/list.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { addItem } from '../api/items';
import CarbonImpact from '../components/CarbonImpact';
import ChipRow from '../components/ChipRow';
import PhotoPicker from '../components/PhotoPicker';
import TopBar from '../components/TopBar';
import { SUBCATEGORIES } from '../lib/carbon';
import {
  CONDITIONS,
  DESCRIPTION_MAX,
  EMPTY_DRAFT,
  LISTING_CATEGORIES,
  ListingDraft,
  MAX_PHOTOS,
  SIZES,
  TITLE_LIMITS,
  validateListing,
} from '../lib/listing';

/**
 * List an item: photos, details and pickup, with a live estimate of the carbon saving and
 * points as soon as the type of item is chosen. On success the new item opens in Item detail.
 */
export default function List() {
  const router = useRouter();
  const [draft, setDraft] = useState<ListingDraft>(EMPTY_DRAFT);
  // Only show errors after the first attempt, so a blank form doesn't start out red.
  const [triedToSubmit, setTriedToSubmit] = useState(false);

  const errors = triedToSubmit ? validateListing(draft) : {};
  const set = <K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  function submit() {
    setTriedToSubmit(true);
    if (Object.keys(validateListing(draft)).length > 0) return;

    const item = addItem(draft);
    setDraft(EMPTY_DRAFT);
    setTriedToSubmit(false);
    router.push({ pathname: '/item/[id]', params: { id: item.id } });
  }

  const label = (text: string) => (
    <Text variant="titleSmall" style={{ marginTop: 20, marginBottom: 8, paddingHorizontal: 16 }}>
      {text}
    </Text>
  );
  const error = (message?: string) =>
    message ? (
      <HelperText type="error" style={{ paddingHorizontal: 16 }}>
        {message}
      </HelperText>
    ) : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TopBar title="List an item" />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        {label('Photos')}
        <View style={{ paddingHorizontal: 16 }}>
          <PhotoPicker
            photos={draft.photos}
            onChange={(photos) => set('photos', photos)}
            max={MAX_PHOTOS}
            error={errors.photos}
          />
        </View>

        <View style={{ paddingHorizontal: 16, gap: 4 }}>
          <TextInput
            mode="outlined"
            label="Title"
            testID="title-input"
            value={draft.title}
            onChangeText={(v) => set('title', v)}
            maxLength={TITLE_LIMITS.max}
            error={!!errors.title}
          />
          {errors.title && <HelperText type="error">{errors.title}</HelperText>}

          <TextInput
            mode="outlined"
            label="Description (optional)"
            testID="description-input"
            value={draft.description}
            onChangeText={(v) => set('description', v)}
            multiline
            numberOfLines={3}
            maxLength={DESCRIPTION_MAX}
            style={{ marginTop: 8 }}
            error={!!errors.description}
          />
          {errors.description && <HelperText type="error">{errors.description}</HelperText>}
        </View>

        {label('Type of item')}
        <ChipRow
          options={[...SUBCATEGORIES]}
          active={draft.subcategory}
          onSelect={(v) => set('subcategory', v)}
        />
        {error(errors.subcategory)}

        {/* Live estimate from the same calculator as Item detail; hidden until a type is chosen. */}
        {draft.subcategory !== '' && (
          <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 4 }}>
            <CarbonImpact subcategory={draft.subcategory} />
            <Text variant="bodySmall">
              You and the person who receives it each earn these points when the swap is completed.
            </Text>
          </View>
        )}

        {label('Who it’s for')}
        <ChipRow
          options={[...LISTING_CATEGORIES]}
          active={draft.category}
          onSelect={(v) => set('category', v)}
        />
        {error(errors.category)}

        {label('Condition')}
        <ChipRow
          options={[...CONDITIONS]}
          active={draft.condition}
          onSelect={(v) => set('condition', v)}
        />
        {error(errors.condition)}

        {label('Size')}
        <ChipRow options={[...SIZES]} active={draft.size} onSelect={(v) => set('size', v)} />
        {error(errors.size)}

        {label('Pickup on campus')}
        <View style={{ paddingHorizontal: 16 }}>
          <TextInput
            mode="outlined"
            label="Where and when, e.g. Library entrance, 1pm Mondays"
            testID="pickup-input"
            value={draft.pickup}
            onChangeText={(v) => set('pickup', v)}
            error={!!errors.pickup}
          />
          {errors.pickup && <HelperText type="error">{errors.pickup}</HelperText>}

          <Button mode="contained" onPress={submit} style={{ marginTop: 24 }}>
            List item
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
