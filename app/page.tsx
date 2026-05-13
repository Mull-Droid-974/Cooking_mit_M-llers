"use client";

import { useMemo } from "react";
import { getDailyRecipes, getTodayString } from "@/lib/dailyMenu";
import { useAppState } from "@/hooks/useAppState";
import DailyMenuSection from "@/components/DailyMenuSection";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const {
    state,
    syncing,
    toggleBookmark,
    cookRecipe,
    rateRecipe,
    uploadPhoto,
    deletePhoto,
    refreshLunch,
    refreshDinner,
    isBookmarked,
    isCooked,
  } = useAppState();

  const { lunch, dinner } = useMemo(() => {
    const today = getTodayString();
    const lunchOffset = state?.dailyRefresh?.lunchOffset ?? 0;
    const dinnerOffset = state?.dailyRefresh?.dinnerOffset ?? 0;
    return getDailyRecipes(today, lunchOffset, dinnerOffset);
  }, [state?.dailyRefresh]);

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (!state) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <span className="text-5xl">🥗</span>
          <p className="text-gray-500 mt-3 text-sm">Menü wird geladen…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Hallo, Familie Müller! 👨‍👩‍👧‍👦
        </h1>
        <p className="text-gray-500 text-sm mt-1 capitalize flex items-center gap-2">
          {today}
          {syncing && <Loader2 size={12} className="animate-spin text-gray-400" />}
        </p>
      </div>

      {/* Daily Badge */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 mb-6 text-white">
        <p className="text-xs font-medium text-green-100 uppercase tracking-wide mb-1">
          Euer Tagesmenü
        </p>
        <p className="font-bold text-lg">4 Rezepte für heute</p>
        <p className="text-green-100 text-sm mt-0.5">
          Alle vegetarisch · Frisch ausgewählt
        </p>
      </div>

      <DailyMenuSection
        title="Mittagessen"
        subtitle="Quick & Easy · unter 20 Min"
        icon="☀️"
        recipes={lunch}
        state={state}
        onRefresh={refreshLunch}
        onBookmark={toggleBookmark}
        onCook={cookRecipe}
        isBookmarked={isBookmarked}
        isCooked={isCooked}
        onRate={rateRecipe}
        onPhotoUpload={uploadPhoto}
        onPhotoDelete={deletePhoto}
      />

      <DailyMenuSection
        title="Abendessen"
        subtitle="Low-Carb & High-Protein"
        icon="🌙"
        recipes={dinner}
        state={state}
        onRefresh={refreshDinner}
        onBookmark={toggleBookmark}
        onCook={cookRecipe}
        isBookmarked={isBookmarked}
        isCooked={isCooked}
        onRate={rateRecipe}
        onPhotoUpload={uploadPhoto}
        onPhotoDelete={deletePhoto}
      />
    </div>
  );
}
