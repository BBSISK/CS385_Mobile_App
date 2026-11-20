import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import CategoryTile from '../CategoryTile';
import { browseCategories, categoryImages } from '../../constants/mockData';

describe('CategoryTile', () => {
  it('shows the category photo and name, and responds to a tap', async () => {
    const onPress = jest.fn();
    await render(
      <PaperProvider>
        <CategoryTile
          label="Bags"
          image="https://images.unsplash.com/photo-1?fm=jpg"
          onPress={onPress}
        />
      </PaperProvider>,
    );

    expect(screen.getByLabelText('Bags')).toBeTruthy(); // the photo
    expect(screen.getByText('Bags')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Browse Bags'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows the placeholder when there is no photo', async () => {
    await render(
      <PaperProvider>
        <CategoryTile label="Bags" />
      </PaperProvider>,
    );
    expect(screen.getByLabelText('Bags (no photo)')).toBeTruthy();
  });
});

describe('Browse category photos', () => {
  it('every Browse category has a JPEG photo and a credit', () => {
    browseCategories.forEach((name) => {
      const photo = categoryImages[name];
      expect(photo).toBeDefined();
      expect(photo.image).toMatch(/^https:\/\/images\.unsplash\.com\/photo-.*fm=jpg/);
      expect(photo.photographer).toBeTruthy();
      expect(photo.source).toMatch(/^https:\/\/unsplash\.com\/photos\//);
    });
  });
});
