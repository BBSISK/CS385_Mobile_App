import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';
import { resetItems } from '../api/items';
import { estimateImpact } from '../lib/carbon';

// The real picker opens the phone's gallery, so the tests use a fake one.
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({ granted: true })),
  requestCameraPermissionsAsync: jest.fn(async () => ({ granted: true })),
  launchImageLibraryAsync: jest.fn(async () => ({
    canceled: false,
    assets: [{ uri: 'file:///hoodie.jpg' }],
  })),
  launchCameraAsync: jest.fn(async () => ({ canceled: true, assets: null })),
}));

const APP_DIR = './src/app';

async function fillValidForm() {
  await fireEvent.changeText(screen.getByTestId('title-input'), 'Grey hoodie');
  await fireEvent.press(screen.getByText('Tops'));
  await fireEvent.press(screen.getByText('Men'));
  await fireEvent.press(screen.getByText('Good'));
  await fireEvent.press(screen.getByText('M'));
  await fireEvent.changeText(screen.getByTestId('pickup-input'), 'Library entrance, 1pm');
}

describe('List screen', () => {
  beforeEach(() => resetItems());

  it('shows what is missing when a blank form is submitted', async () => {
    await renderRouter(APP_DIR, { initialUrl: '/list' });

    await fireEvent.press(screen.getByText('List item'));

    expect(screen.getByText('Add a title of at least 3 characters')).toBeTruthy();
    expect(screen.getByText('Choose the type of item')).toBeTruthy();
    expect(screen.getByText('Say where on campus to pick it up')).toBeTruthy();
    expect(screen).toHavePathname('/list');
  });

  it('shows the carbon saving as soon as a type of item is picked', async () => {
    await renderRouter(APP_DIR, { initialUrl: '/list' });
    expect(screen.queryByText(/kg CO₂e/)).toBeNull();

    await fireEvent.press(screen.getByText('Outerwear'));

    const { kgCo2e, points } = estimateImpact('Outerwear')!;
    expect(screen.getByText(`Saves ~${kgCo2e} kg CO₂e · Earns ${points} points`)).toBeTruthy();
  });

  it('adds a photo from the gallery', async () => {
    await renderRouter(APP_DIR, { initialUrl: '/list' });

    await fireEvent.press(screen.getByText('Add photos'));

    expect(await screen.findByLabelText('Photo 1')).toBeTruthy();
    expect(screen.getByText('1 of 3 photos (optional for now)')).toBeTruthy();
  });

  it('lists the item, opens it, and shows it on Home', async () => {
    await renderRouter(APP_DIR, { initialUrl: '/list' });
    await fillValidForm();

    await fireEvent.press(screen.getByText('List item'));

    expect(screen).toHavePathname('/item/7');
    expect(screen.getByText('Grey hoodie')).toBeTruthy();
    expect(screen.getByText(/Saves ~3.6 kg CO₂e/)).toBeTruthy();

    await act(() => router.push('/'));
    expect(screen.getByText('Grey hoodie')).toBeTruthy();
  });
});
