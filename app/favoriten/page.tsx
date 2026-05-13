"use client";

import { useState } from "react";
import { ChefHat, Star } from "lucide-react";
import { useAppState } from "@/hooks/useAppState";
import { getRecipeById } from "@/lib/recipes";
import RecipeDetailModal from "@/components/RecipeDetailModal";
import StarRating from "@/components/StarRating";
import type { Recipe, FamilyMember, SavedRecipe } from "@/types";
import { FAMILY_MEMBERS } from "@/types";
import { cn } from "@/lib/utils";

function avgRating(entry: SavedRecipe): number {
  const vals = Object.values(entry.familyRatings).filter(Boolean) as number[];
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

function CookedCard({
  recipe,
  saved,
  onClick,
}: {
  recipe: Recipe;
  saved: SavedRecipe;
  onClick: () => void;
}) {
  const avg = avgRating(saved);
  const cookedDate = saved.cookedAt
    ? new Date(saved.cookedAt).toLocaleDateString("de-DE", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      {saved.photos.length > 0 && (
        <div className="relative aspect-[2/1] overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={saved.photos[0]}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          {saved.photos.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              +{saved.photos.length - 1} Fotos
            </span>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">{recipe.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 leading-tight">{recipe.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              {cookedDate && (
                <span className="text-xs text-gray-400">Gekocht am {cookedDate}</span>
              )}
              {avg > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold">
                  <Star size={11} className="fill-amber-400" />
                  {avg.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mini scoreboard preview */}
        {Object.keys(saved.familyRatings).length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
            {FAMILY_MEMBERS.filter((m) => saved.familyRatings[m]).map((member) => (
              <div key={member} className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{member}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={10}
                      className={cn(
                        s <= (saved.familyRatings[member] ?? 0)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-none text-gray-200"
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FavoritenPage() {
  const { state, rateRecipe, uploadPhoto, deletePhoto } = useAppState();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  if (!state) return null;

  const cookedItems = state.cooked
    .map((c) => {
      const recipe = getRecipeById(c.recipeId);
      return recipe ? { recipe, saved: c } : null;
    })
    .filter(Boolean) as { recipe: Recipe; saved: SavedRecipe }[];

  const selectedSaved = selectedRecipe
    ? state.cooked.find((c) => c.recipeId === selectedRecipe.id)
    : undefined;

  const overallAvg =
    cookedItems.length > 0
      ? cookedItems.reduce((sum, { saved }) => sum + avgRating(saved), 0) / cookedItems.length
      : 0;

  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ChefHat className="text-green-500" size={24} />
          Schon gekocht
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Eure Kochgeschichte mit Fotos & Bewertungen
        </p>
      </div>

      {/* Stats bar */}
      {cookedItems.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{cookedItems.length}</p>
            <p className="text-xs text-green-700 mt-0.5">Rezepte gekocht</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-500">
              {overallAvg > 0 ? overallAvg.toFixed(1) : "–"}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">Durchschnitt ⭐</p>
          </div>
        </div>
      )}

      {cookedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-4">👨‍🍳</span>
          <p className="text-gray-700 font-semibold text-lg">Noch nichts gekocht</p>
          <p className="text-gray-400 text-sm mt-2 max-w-xs">
            Markiere ein Rezept als &quot;Gekocht&quot; um es hier zu sehen
            und mit eurer Familie zu bewerten.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {cookedItems.map(({ recipe, saved }) => (
            <CookedCard
              key={recipe.id}
              recipe={recipe}
              saved={saved}
              onClick={() => setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      )}

      {selectedRecipe && selectedSaved && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          savedEntry={selectedSaved}
          isCooked
          onClose={() => setSelectedRecipe(null)}
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
