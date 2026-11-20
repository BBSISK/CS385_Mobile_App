import { describe, expect, it } from '@jest/globals';
import {
  DESCRIPTION_MAX,
  EMPTY_DRAFT,
  isListingValid,
  ListingDraft,
  MAX_PHOTOS,
  TITLE_LIMITS,
  validateListing,
} from '../listing';

const valid: ListingDraft = {
  title: 'Grey hoodie',
  description: 'Worn a few times',
  category: 'Men',
  subcategory: 'Tops',
  condition: 'Good',
  size: 'M',
  pickup: 'Library entrance, 1pm Mondays',
  photos: [],
};

describe('validateListing', () => {
  it('accepts a complete listing, with or without photos', () => {
    expect(validateListing(valid)).toEqual({});
    expect(isListingValid({ ...valid, photos: ['file:///a.jpg'] })).toBe(true);
  });

  it('reports every missing field on a blank form', () => {
    expect(Object.keys(validateListing(EMPTY_DRAFT)).sort()).toEqual(
      ['category', 'condition', 'pickup', 'size', 'subcategory', 'title'].sort(),
    );
  });

  it('allows an empty description', () => {
    expect(validateListing({ ...valid, description: '' })).toEqual({});
  });

  it.each([
    ['too short', 'ab', true],
    ['only spaces', '      ', true],
    ['exactly the minimum', 'a'.repeat(TITLE_LIMITS.min), false],
    ['exactly the maximum', 'a'.repeat(TITLE_LIMITS.max), false],
    ['over the maximum', 'a'.repeat(TITLE_LIMITS.max + 1), true],
  ])('title %s', (_label, title, hasError) => {
    expect('title' in validateListing({ ...valid, title })).toBe(hasError);
  });

  it('trims spaces before checking the title length', () => {
    expect(validateListing({ ...valid, title: '  ab  ' }).title).toBeDefined();
  });

  it('rejects a description over the limit', () => {
    const description = 'a'.repeat(DESCRIPTION_MAX + 1);
    expect(validateListing({ ...valid, description }).description).toBeDefined();
  });

  it('rejects values that are not on the form', () => {
    const errors = validateListing({
      ...valid,
      category: 'Kids',
      subcategory: 'Hats',
      condition: 'Broken',
      size: 'XXXL',
    });
    expect(Object.keys(errors).sort()).toEqual(['category', 'condition', 'size', 'subcategory']);
  });

  it('rejects more than the maximum number of photos', () => {
    const photos = Array.from({ length: MAX_PHOTOS + 1 }, (_, i) => `file:///${i}.jpg`);
    expect(validateListing({ ...valid, photos }).photos).toBeDefined();
  });
});
