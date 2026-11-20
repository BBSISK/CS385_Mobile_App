// src/api/items.ts
/**
 * Data layer for marketplace items. Screens read and add items ONLY through these functions.
 *
 * For now items live in memory, starting from the mock data, so a new listing shows up on
 * Home, Browse, Item detail and Wardrobe straight away (it's gone when the app restarts).
 * When Supabase is ready, only this file changes: read from and insert into the `items` table.
 */
import { useSyncExternalStore } from 'react';
import { items as mockItems } from '../constants/mockData';
import type { ListingDraft } from '../lib/listing';

/** A marketplace item, as the screens use it. */
export interface Item {
  id: string;
  title: string;
  condition: string;
  size: string;
  /** Who it's for: Women, Men, Sportswear or Designer. */
  category: string;
  /** Type of item, e.g. "Outerwear". Drives the carbon estimate. */
  subcategory: string;
  status: string;
  uploaded: string;
  description: string;
  pickup: string;
  /** Main photo shown on cards and Item detail. */
  image?: string;
  /** All photos, for listings made in the app. */
  photos?: string[];
  imageCredit?: { photographer: string; source: string };
}

let items: Item[] = [...mockItems];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return items;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** All items, newest first. Screens re-render when an item is added. */
export function useItems(): Item[] {
  // The third argument is used when the web build pre-renders pages on the server.
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * One item by id.
 * @returns the item, or undefined if there's no item with that id
 */
export function useItem(id: string | undefined): Item | undefined {
  return useItems().find((item) => item.id === id);
}

/** Next id: one more than the highest numeric id so far, e.g. "7" after the six mock items. */
function nextId(): string {
  const highest = items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
  return String(highest + 1);
}

/**
 * Adds a new listing. Call only with a draft that passed validateListing().
 * @param draft - the List screen's form values
 * @returns the new item, so the screen can open it
 */
export function addItem(draft: ListingDraft): Item {
  const item: Item = {
    id: nextId(),
    title: draft.title.trim(),
    description: draft.description.trim(),
    category: draft.category,
    subcategory: draft.subcategory,
    condition: draft.condition,
    size: draft.size,
    pickup: draft.pickup.trim(),
    status: 'Active',
    uploaded: 'Just now',
    photos: draft.photos,
    image: draft.photos[0],
  };
  items = [item, ...items];
  emit();
  return item;
}

/** Puts the items back to the mock data. For tests only. */
export function resetItems() {
  items = [...mockItems];
  emit();
}
