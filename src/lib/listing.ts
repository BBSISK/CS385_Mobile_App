/**
 * Rules for listing a new item (the List screen).
 * Pure functions, so the rules are unit-tested and the screen only shows the messages.
 */
import { isSubcategory } from './carbon';

/** Who the item is for. Matches the Home screen filter chips (minus "All"). */
export const LISTING_CATEGORIES = ['Women', 'Men', 'Sportswear', 'Designer'] as const;

/** How worn the item is, best first. */
export const CONDITIONS = ['New', 'Like new', 'Good', 'Fair'] as const;

/** Sizes offered on the form. */
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'One size'] as const;

/** A listing can have at most this many photos. */
export const MAX_PHOTOS = 3;

export const TITLE_LIMITS = { min: 3, max: 60 } as const;
export const DESCRIPTION_MAX = 500;
export const PICKUP_LIMITS = { min: 3, max: 100 } as const;

/** What the student has typed or picked so far. Empty string means "not chosen yet". */
export interface ListingDraft {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  condition: string;
  size: string;
  pickup: string;
  /** Local photo URIs from the camera or gallery. */
  photos: string[];
}

/** One message per field that has a problem. An empty object means the listing is valid. */
export type ListingErrors = Partial<Record<keyof ListingDraft, string>>;

/** A blank form. */
export const EMPTY_DRAFT: ListingDraft = {
  title: '',
  description: '',
  category: '',
  subcategory: '',
  condition: '',
  size: '',
  pickup: '',
  photos: [],
};

const oneOf = (list: readonly string[], value: string) => list.includes(value);

/**
 * Checks a draft listing.
 * Photos are optional for now: real uploads arrive with Supabase Storage, and the item
 * card shows a placeholder until then.
 * @param draft - the form values
 * @returns a message for each invalid field; `{}` when everything is fine
 */
export function validateListing(draft: ListingDraft): ListingErrors {
  const errors: ListingErrors = {};
  const title = draft.title.trim();
  const pickup = draft.pickup.trim();

  if (title.length < TITLE_LIMITS.min) {
    errors.title = `Add a title of at least ${TITLE_LIMITS.min} characters`;
  } else if (title.length > TITLE_LIMITS.max) {
    errors.title = `Keep the title under ${TITLE_LIMITS.max} characters`;
  }

  if (draft.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `Keep the description under ${DESCRIPTION_MAX} characters`;
  }

  if (!oneOf(LISTING_CATEGORIES, draft.category)) errors.category = 'Choose who it’s for';
  if (!isSubcategory(draft.subcategory)) errors.subcategory = 'Choose the type of item';
  if (!oneOf(CONDITIONS, draft.condition)) errors.condition = 'Choose the condition';
  if (!oneOf(SIZES, draft.size)) errors.size = 'Choose a size';

  if (pickup.length < PICKUP_LIMITS.min) {
    errors.pickup = 'Say where on campus to pick it up';
  } else if (pickup.length > PICKUP_LIMITS.max) {
    errors.pickup = `Keep the pickup details under ${PICKUP_LIMITS.max} characters`;
  }

  if (draft.photos.length > MAX_PHOTOS) errors.photos = `Add up to ${MAX_PHOTOS} photos`;

  return errors;
}

/** True when the draft has no errors. */
export function isListingValid(draft: ListingDraft): boolean {
  return Object.keys(validateListing(draft)).length === 0;
}
