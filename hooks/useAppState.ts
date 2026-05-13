"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

async function fetchRemoteState(): Promise<AppState | null> {
  try {
    const res = await fetch("/api/state", { cache: "no-store" });
    const data = await res.json();
    return data.state ?? null;
  } catch {
    return null;
  }
}

async function pushRemoteState(state: AppState): Promise<void> {
  try {
    await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
  } catch {
    // silently fail – local state is still intact
  }
}

export function useAppState() {
  const [state, setState] = useState<AppState | null>(null);
  const [syncing, setSyncing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Show local state instantly, then replace with server state
    const local = loadState();
    setState(local);

    setSyncing(true);
    fetchRemoteState().then((remote) => {
      if (remote) {
        // Preserve today's refresh offsets from local if date matches
        const merged: AppState = {
          ...remote,
          dailyRefresh:
            remote.dailyRefresh?.date === local.dailyRefresh?.date
              ? {
                  ...remote.dailyRefresh,
                  lunchOffset: Math.max(
                    remote.dailyRefresh?.lunchOffset ?? 0,
                    local.dailyRefresh?.lunchOffset ?? 0
                  ),
                  dinnerOffset: Math.max(
                    remote.dailyRefresh?.dinnerOffset ?? 0,
                    local.dailyRefresh?.dinnerOffset ?? 0
                  ),
                }
              : remote.dailyRefresh,
        };
        setState(merged);
        saveState(merged);
      }
      setSyncing(false);
    });
  }, []);

  const update = useCallback((updater: (s: AppState) => AppState) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveState(next);

      // Debounced remote push – 800ms after last change
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        pushRemoteState(next);
      }, 800);

      return next;
    });
  }, []);

  const toggleBookmark = useCallback(
    (recipeId: string) => {
      update((s) =>
        s.bookmarks.some((b) => b.recipeId === recipeId)
          ? removeBookmark(s, recipeId)
          : addBookmark(s, recipeId)
      );
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
    syncing,
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
