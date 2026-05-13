import type { AppState, SavedRecipe, FamilyMember } from "@/types";
import { getTodayString } from "./dailyMenu";

const STORAGE_KEY = "cooking-mit-mullers";

function getDefaultState(): AppState {
  return {
    bookmarks: [],
    cooked: [],
    dailyRefresh: {
      date: getTodayString(),
      lunchOffset: 0,
      dinnerOffset: 0,
    },
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed: AppState = JSON.parse(raw);
    const today = getTodayString();
    if (parsed.dailyRefresh?.date !== today) {
      parsed.dailyRefresh = { date: today, lunchOffset: 0, dinnerOffset: 0 };
    }
    return parsed;
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addBookmark(state: AppState, recipeId: string): AppState {
  if (state.bookmarks.some((b) => b.recipeId === recipeId)) return state;
  const newBookmark: SavedRecipe = {
    recipeId,
    savedAt: new Date().toISOString(),
    photos: [],
    familyRatings: {},
  };
  return { ...state, bookmarks: [...state.bookmarks, newBookmark] };
}

export function removeBookmark(state: AppState, recipeId: string): AppState {
  return { ...state, bookmarks: state.bookmarks.filter((b) => b.recipeId !== recipeId) };
}

export function markAsCooked(state: AppState, recipeId: string): AppState {
  const existing = state.cooked.find((c) => c.recipeId === recipeId);
  if (existing) return state;
  const bookmark = state.bookmarks.find((b) => b.recipeId === recipeId);
  const cookedEntry: SavedRecipe = bookmark
    ? { ...bookmark, cookedAt: new Date().toISOString() }
    : {
        recipeId,
        savedAt: new Date().toISOString(),
        cookedAt: new Date().toISOString(),
        photos: [],
        familyRatings: {},
      };
  return {
    ...state,
    cooked: [...state.cooked, cookedEntry],
    bookmarks: state.bookmarks.filter((b) => b.recipeId !== recipeId),
  };
}

export function updateFamilyRating(
  state: AppState,
  recipeId: string,
  member: FamilyMember,
  rating: number
): AppState {
  const updateEntry = (entry: SavedRecipe): SavedRecipe =>
    entry.recipeId === recipeId
      ? { ...entry, familyRatings: { ...entry.familyRatings, [member]: rating } }
      : entry;

  return {
    ...state,
    cooked: state.cooked.map(updateEntry),
  };
}

export function addPhoto(state: AppState, recipeId: string, photoDataUrl: string): AppState {
  const updateEntry = (entry: SavedRecipe): SavedRecipe =>
    entry.recipeId === recipeId ? { ...entry, photos: [...entry.photos, photoDataUrl] } : entry;

  return {
    ...state,
    cooked: state.cooked.map(updateEntry),
    bookmarks: state.bookmarks.map(updateEntry),
  };
}

export function removePhoto(state: AppState, recipeId: string, index: number): AppState {
  const updateEntry = (entry: SavedRecipe): SavedRecipe =>
    entry.recipeId === recipeId
      ? { ...entry, photos: entry.photos.filter((_, i) => i !== index) }
      : entry;

  return {
    ...state,
    cooked: state.cooked.map(updateEntry),
    bookmarks: state.bookmarks.map(updateEntry),
  };
}

export function refreshLunch(state: AppState): AppState {
  return {
    ...state,
    dailyRefresh: {
      ...state.dailyRefresh,
      lunchOffset: state.dailyRefresh.lunchOffset + 1,
    },
  };
}

export function refreshDinner(state: AppState): AppState {
  return {
    ...state,
    dailyRefresh: {
      ...state.dailyRefresh,
      dinnerOffset: state.dailyRefresh.dinnerOffset + 1,
    },
  };
}
