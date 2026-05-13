"use client";

import { useState, useRef } from "react";
import { X, Clock, Users, ChevronDown, ChevronUp, Camera, Trash2, Bookmark, ChefHat } from "lucide-react";
import type { Recipe, SavedRecipe, FamilyMember } from "@/types";
import { FAMILY_MEMBERS } from "@/types";
import StarRating from "./StarRating";
import { cn } from "@/lib/utils";

type Props = {
  recipe: Recipe;
  savedEntry?: SavedRecipe;
  isBookmarked?: boolean;
  isCooked?: boolean;
  onClose: () => void;
  onBookmark?: () => void;
  onCook?: () => void;
  onRate?: (member: FamilyMember, rating: number) => void;
  onPhotoUpload?: (dataUrl: string) => void;
  onPhotoDelete?: (index: number) => void;
};

export default function RecipeDetailModal({
  recipe,
  savedEntry,
  isBookmarked,
  isCooked,
  onClose,
  onBookmark,
  onCook,
  onRate,
  onPhotoUpload,
  onPhotoDelete,
}: Props) {
  const [showIngredients, setShowIngredients] = useState(true);
  const [showSteps, setShowSteps] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) onPhotoUpload?.(result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const avgRating = savedEntry
    ? (() => {
        const vals = Object.values(savedEntry.familyRatings).filter(Boolean) as number[];
        return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      })()
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-0">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{recipe.emoji}</span>
            <div>
              <h2 className="font-bold text-gray-900 text-lg leading-tight">{recipe.title}</h2>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {recipe.prepTime} Min
                </span>
                <span className="flex items-center gap-1">
                  <Users size={11} /> {recipe.servings} Pers.
                </span>
                {recipe.protein && (
                  <span className="text-green-600 font-medium">💪 {recipe.protein}g Protein</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 active:bg-gray-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 pb-32 pt-3">
          <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recipe.tags.map((tag) => (
              <span key={tag} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* Ingredients */}
          <button
            onClick={() => setShowIngredients(!showIngredients)}
            className="w-full flex items-center justify-between py-3 border-b border-gray-100 font-semibold text-gray-800"
          >
            <span>Zutaten</span>
            {showIngredients ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {showIngredients && (
            <ul className="mt-2 mb-4 space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          )}

          {/* Steps */}
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="w-full flex items-center justify-between py-3 border-b border-gray-100 font-semibold text-gray-800"
          >
            <span>Zubereitung</span>
            {showSteps ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {showSteps && (
            <ol className="mt-2 mb-4 space-y-3">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          )}

          {/* Family Scoreboard – nur bei gespeicherten Rezepten */}
          {savedEntry && onRate && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                ⭐ Family Scoreboard
                {avgRating > 0 && (
                  <span className="text-sm text-amber-500 font-medium">
                    Ø {avgRating.toFixed(1)} / 5
                  </span>
                )}
              </h3>
              <div className="space-y-3">
                {FAMILY_MEMBERS.map((member) => (
                  <div key={member} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-24">{member}</span>
                    <StarRating
                      rating={savedEntry.familyRatings[member] ?? 0}
                      onRate={(r) => onRate(member, r)}
                      size={18}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Upload – nur bei gespeicherten Rezepten */}
          {savedEntry && onPhotoUpload && (
            <div className="mt-5">
              <h3 className="font-semibold text-gray-800 mb-3">📸 Fotos</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-green-200 rounded-xl py-4 flex items-center justify-center gap-2 text-green-600 font-medium text-sm active:bg-green-50 transition-colors min-h-[56px]"
              >
                <Camera size={18} />
                Foto hinzufügen
              </button>
              {savedEntry.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {savedEntry.photos.map((photo, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      {onPhotoDelete && (
                        <button
                          onClick={() => onPhotoDelete(i)}
                          className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        {(onBookmark || onCook) && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white flex safe-bottom">
            {onBookmark && (
              <button
                onClick={onBookmark}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors min-h-[56px]",
                  isBookmarked ? "text-green-600 bg-green-50" : "text-gray-600 active:bg-gray-50"
                )}
              >
                <Bookmark size={17} className={cn(isBookmarked && "fill-green-600")} />
                {isBookmarked ? "Vorgemerkt" : "Vormerken"}
              </button>
            )}
            {onBookmark && onCook && <div className="w-px bg-gray-100" />}
            {onCook && !isCooked && (
              <button
                onClick={onCook}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold text-white bg-green-500 active:bg-green-600 transition-colors min-h-[56px]"
              >
                <ChefHat size={17} />
                Als gekocht markieren
              </button>
            )}
            {onCook && isCooked && (
              <div className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold text-amber-600 bg-amber-50">
                <ChefHat size={17} />
                Bereits gekocht ✓
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
