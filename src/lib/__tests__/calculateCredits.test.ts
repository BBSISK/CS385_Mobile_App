import { calculateCredits, CREDITS_BY_CATEGORY, Category } from '../calculateCredits';

describe('calculateCredits', () => {
  it('awards more credits for electrical items than for books', () => {
    expect(calculateCredits('Electrical')).toBeGreaterThan(calculateCredits('Books'));
  });

  it('returns a positive whole number for every category', () => {
    (Object.keys(CREDITS_BY_CATEGORY) as Category[]).forEach((category) => {
      const credits = calculateCredits(category);
      expect(credits).toBeGreaterThan(0);
      expect(Number.isInteger(credits)).toBe(true);
    });
  });

  it('returns the configured value for a category', () => {
    expect(calculateCredits('Clothes')).toBe(CREDITS_BY_CATEGORY.Clothes);
  });
});
