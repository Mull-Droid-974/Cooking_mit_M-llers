"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useAppState } from "@/hooks/useAppState";
import { getRecipeById } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetailModal from "@/components/RecipeDetailModal";
import type { Recipe, FamilyMember } from "@/types";

export default function VormerkenPage() {
  const {
    state,
    toggleBookmark,
    cookRecipe,
    rateRecipe,
    uploadPhoto,
    deletePhoto,
    isBookmarked,
    isCooked,
  } = useAppState();

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  if (!state) return null;

  const bookmarkedRecipes = state.bookmarks
    .map((b) => {
      const recipe = getRecipeById(b.recipeId);
      return recipe ? { recipe, saved: b } : null;
    })
    .filter(Boolean) as { recipe: Recipe; saved: (typeof state.bookmarks)[0] }[];

  const selectedSaved = selectedRecipe
    ? state.bookmarks.find((b) => b.recipeId === selectedRecipe.id) ??
      state.cooked.find((c) => c.recipeId === selectedRecipe.id)
    : undefined;

  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bookmark className="text-green-500" size={24} />
          Vorgemerkt
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Rezepte, die ihr noch kochen möchtet
        </p>
      </div>

      {bookmarkedRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-4">📌</span>
          <p className="text-gray-700 font-semibold text-lg">Noch nichts vorgemerkt</p>
          <p className="text-gray-400 text-sm mt-2 max-w-xs">
            Tippe auf &quot;Vormerken&quot; bei einem Rezept auf der Startseite,
            um es hier zu speichern.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarkedRecipes.map(({ recipe }) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isBookmarked={isBookmarked(recipe.id)}
              isCooked={isCooked(recipe.id)}
              onBookmark={() => toggleBookmark(recipe.id)}
              onCook={() => cookRecipe(recipe.id)}
              onClick={() => setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          savedEntry={selectedSaved}
          isBookmarked={isBookmarked(selectedRecipe.id)}
          isCooked={isCooked(selectedRecipe.id)}
          onClose={() => setSelectedRecipe(null)}
          onBookmark={() => toggleBookmark(selectedRecipe.id)}
          onCook={() => {
            cookRecipe(selectedRecipe.id);
            setSelectedRecipe(null);
          }}
          onRate={(member: FamilyMember, rating: number) =>
            rateRecipe(selectedRecipe.id, member, rating)
          }
          onPhotoUpload={(dataUrl: string) => uploadPhoto(selectedRecipe.id, dataUrl)}
          onPhotoDelete={(index: number) => deletePhoto(selectedRecipe.id, index)}
        />
      )}
    </div>
  );
}
