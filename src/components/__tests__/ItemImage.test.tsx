import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import ItemImage from '../ItemImage';
import { items } from '../../constants/mockData';

function renderImage(uri?: string) {
  return render(
    <PaperProvider>
      <ItemImage uri={uri} label="Denim jacket" />
    </PaperProvider>,
  );
}

describe('ItemImage', () => {
  it('shows the photo, labelled for screen readers', async () => {
    await renderImage('https://images.unsplash.com/photo-1?w=600');
    expect(screen.getByLabelText('Denim jacket')).toBeTruthy();
  });

  it('falls back to a placeholder when there is no photo', async () => {
    await renderImage(undefined);
    expect(screen.getByLabelText('Denim jacket (no photo)')).toBeTruthy();
  });
});

describe('mock item photos', () => {
  it('every mock item has an Unsplash photo and a credit', () => {
    items.forEach((item) => {
      expect(item.image).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/);
      expect(item.imageCredit.photographer).toBeTruthy();
      expect(item.imageCredit.source).toMatch(/^https:\/\/unsplash\.com\/photos\//);
    });
  });
});
