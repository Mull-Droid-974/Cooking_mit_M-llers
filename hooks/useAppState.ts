"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppState, FamilyMember } from "@/types";
import {
  loadState,
  saveState,
  addBookmark,
  removeBookmark,
  markAsCooked,
  updateFamilyRating,
  addPhoto,
  removePhoto,
  refreshLunch,
  refreshDinner,
} from "@/lib/storage";

export function useAppState() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  const update = useCallback((updater: (s: AppState) => AppState) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback(
    (recipeId: string) => {
      update((s) => {
        if (s.bookmarks.some((b) => b.recipeId === recipeId)) {
          return removeBookmark(s, recipeId);
        }
        return addBookmark(s, recipeId);
      });
    },
    [update]
  );

  const cookRecipe = useCallback(
    (recipeId: string) => update((s) => markAsCooked(s, recipeId)),
    [update]
  );

  const rateRecipe = useCallback(
    (recipeId: string, member: FamilyMember, rating: number) =>
      update((s) => updateFamilyRating(s, recipeId, member, rating)),
    [update]
  );

  const uploadPhoto = useCallback(
    (recipeId: string, dataUrl: string) => update((s) => addPhoto(s, recipeId, dataUrl)),
    [update]
  );

  const deletePhoto = useCallback(
    (recipeId: string, index: number) => update((s) => removePhoto(s, recipeId, index)),
    [update]
  );

  const doRefreshLunch = useCallback(() => update(refreshLunch), [update]);
  const doRefreshDinner = useCallback(() => update(refreshDinner), [update]);

  const isBookmarked = useCallback(
    (recipeId: string) => state?.bookmarks.some((b) => b.recipeId === recipeId) ?? false,
    [state]
  );

  const isCooked = useCallback(
    (recipeId: string) => state?.cooked.some((c) => c.recipeId === recipeId) ?? false,
    [state]
  );

  return {
    state,
    toggleBookmark,
    cookRecipe,
    rateRecipe,
    uploadPhoto,
    deletePhoto,
    refreshLunch: doRefreshLunch,
    refreshDinner: doRefreshDinner,
    isBookmarked,
    isCooked,
  };
}
