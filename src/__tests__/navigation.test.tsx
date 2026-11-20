import { describe, expect, it } from '@jest/globals';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';

// Renders the real app (src/app) with Expo Router, so these tests tap the same screens as Expo Go.
// Kept outside src/app because every file in there becomes a route.
const APP_DIR = './src/app'; // relative to the project root, where Jest runs

describe('navigation', () => {
  it('opens Item detail when an item card on Home is tapped', async () => {
    await renderRouter(APP_DIR, { initialUrl: '/' });

    await fireEvent.press(screen.getByText('Denim jacket'));

    expect(screen).toHavePathname('/item/1');
    expect(screen.getByText('Preferred pick up')).toBeTruthy();
    expect(screen.getByText(/kg CO₂e · Earns/)).toBeTruthy();
  });

  it('goes Browse → category → item, and back returns to the category', async () => {
    await renderRouter(APP_DIR, { initialUrl: '/browse' });

    await fireEvent.press(screen.getByText('Outerwear'));
    expect(screen).toHavePathname('/category/Outerwear');

    await fireEvent.press(screen.getByText('Wool coat'));
    expect(screen).toHavePathname('/item/3');

    await act(() => router.back());
    expect(screen).toHavePathname('/category/Outerwear');
  });

  it('can open an item from a link (e.g. a shared URL)', async () => {
    await renderRouter(APP_DIR, { initialUrl: '/item/2' });

    expect(screen).toHavePathname('/item/2');
    expect(screen.getByText('Rugby jersey')).toBeTruthy();
  });
});
