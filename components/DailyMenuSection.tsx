"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Recipe } from "@/types";
import RecipeCard from "./RecipeCard";
import RecipeDetailModal from "./RecipeDetailModal";
import type { AppState, FamilyMember } from "@/types";

type Props = {
  title: string;
  subtitle: string;
  icon: string;
  recipes: Recipe[];
  state: AppState | null;
  onRefresh: () => void;
  onBookmark: (id: string) => void;
  onCook: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  isCooked: (id: string) => boolean;
  onRate: (recipeId: string, member: FamilyMember, rating: number) => void;
  onPhotoUpload: (recipeId: string, dataUrl: string) => void;
  onPhotoDelete: (recipeId: string, index: number) => void;
};

export default function DailyMenuSection({
  title,
  subtitle,
  icon,
  recipes,
  state,
  onRefresh,
  onBookmark,
  onCook,
  isBookmarked,
  isCooked,
  onRate,
  onPhotoUpload,
  onPhotoDelete,
}: Props) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  const selectedSaved = selectedRecipe
    ? state?.cooked.find((c) => c.recipeId === selectedRecipe.id) ??
      state?.bookmarks.find((b) => b.recipeId === selectedRecipe.id)
    : undefined;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>{icon}</span>
            {title}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-sm text-green-600 font-medium bg-green-50 px-3 py-2 rounded-xl active:bg-green-100 transition-colors min-h-[44px]"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Neue Ideen
        </button>
      </div>

      <div className="space-y-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isBookmarked={isBookmarked(recipe.id)}
            isCooked={isCooked(recipe.id)}
            onBookmark={() => onBookmark(recipe.id)}
            onCook={() => onCook(recipe.id)}
            onClick={() => setSelectedRecipe(recipe)}
          />
        ))}
      </div>

      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          savedEntry={selectedSaved}
          isBookmarked={isBookmarked(selectedRecipe.id)}
          isCooked={isCooked(selectedRecipe.id)}
          onClose={() => setSelectedRecipe(null)}
          onBookmark={() => onBookmark(selectedRecipe.id)}
          onCook={() => {
            onCook(selectedRecipe.id);
            setSelectedRecipe(null);
          }}
          onRate={(member, rating) => onRate(selectedRecipe.id, member, rating)}
          onPhotoUpload={(dataUrl) => onPhotoUpload(selectedRecipe.id, dataUrl)}
          onPhotoDelete={(index) => onPhotoDelete(selectedRecipe.id, index)}
        />
      )}
    </section>
  );
}
