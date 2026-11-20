import { beforeEach, describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { addItem, resetItems, useItems } from '../items';
import { items as mockItems } from '../../constants/mockData';
import type { ListingDraft } from '../../lib/listing';

const draft: ListingDraft = {
  title: '  Grey hoodie  ',
  description: '',
  category: 'Men',
  subcategory: 'Tops',
  condition: 'Good',
  size: 'M',
  pickup: 'Library',
  photos: ['file:///one.jpg', 'file:///two.jpg'],
};

describe('items data layer', () => {
  beforeEach(() => resetItems());

  it('starts with the mock items', async () => {
    const { result } = await renderHook(() => useItems());
    expect(result.current).toHaveLength(mockItems.length);
  });

  it('adds a new listing to the front, as Active, with the next id', async () => {
    const { result } = await renderHook(() => useItems());
    let created: ReturnType<typeof addItem> | undefined;
    await act(() => {
      created = addItem(draft);
    });

    expect(created).toMatchObject({ id: '7', title: 'Grey hoodie', status: 'Active' });
    expect(result.current[0].id).toBe('7');
    expect(result.current).toHaveLength(mockItems.length + 1);
  });

  it('uses the first photo as the main image', () => {
    expect(addItem(draft).image).toBe('file:///one.jpg');
  });

  it('has no main image when no photos were added', () => {
    expect(addItem({ ...draft, photos: [] }).image).toBeUndefined();
  });
});
