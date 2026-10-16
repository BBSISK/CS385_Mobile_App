/**
 * Carbon credits awarded per item category for a completed exchange.
 * Placeholder values until docs/carbon-credits.md is agreed (CS385-36).
 */
export const CREDITS_BY_CATEGORY = {
  Electrical: 10,
  Furniture: 8,
  Clothes: 5,
  Kitchen: 4,
  Books: 3,
  Other: 2,
} as const;

/** The item categories the marketplace supports. */
export type Category = keyof typeof CREDITS_BY_CATEGORY;

/**
 * Returns the total credits for a completed exchange of an item.
 * @param category - the item's category
 * @returns credits to be split between giver and receiver
 */
export function calculateCredits(category: Category): number {
  return CREDITS_BY_CATEGORY[category];
}
