"use client";

import { Clock, Users, Bookmark, ChefHat, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/types";

type Props = {
  recipe: Recipe;
  isBookmarked?: boolean;
  isCooked?: boolean;
  onBookmark?: () => void;
  onCook?: () => void;
  onClick?: () => void;
  avgRating?: number;
};

export default function RecipeCard({
  recipe,
  isBookmarked = false,
  isCooked = false,
  onBookmark,
  onCook,
  onClick,
  avgRating,
}: Props) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-4xl flex-shrink-0 leading-none">{recipe.emoji}</span>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2">
                {recipe.title}
              </h3>
              <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">{recipe.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {recipe.prepTime} Min
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} />
            {recipe.servings} Pers.
          </span>
          {recipe.protein && (
            <span className="flex items-center gap-1 text-green-600 font-medium">
              💪 {recipe.protein}g Protein
            </span>
          )}
          {avgRating !== undefined && avgRating > 0 && (
            <span className="flex items-center gap-1 text-amber-500 font-medium ml-auto">
              <Star size={12} className="fill-amber-400" />
              {avgRating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {(onBookmark || onCook) && (
        <div className="border-t border-gray-50 flex">
          {onBookmark && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark();
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors min-h-[44px]",
                isBookmarked
                  ? "text-green-600 bg-green-50"
                  : "text-gray-500 active:bg-gray-50"
              )}
            >
              <Bookmark
                size={16}
                className={cn(isBookmarked && "fill-green-600")}
              />
              {isBookmarked ? "Vorgemerkt" : "Vormerken"}
            </button>
          )}
          {onBookmark && onCook && (
            <div className="w-px bg-gray-100" />
          )}
          {onCook && !isCooked && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCook();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-500 active:bg-gray-50 transition-colors min-h-[44px]"
            >
              <ChefHat size={16} />
              Gekocht!
            </button>
          )}
          {onCook && isCooked && (
            <div className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-amber-600 bg-amber-50 min-h-[44px]">
              <ChefHat size={16} />
              Schon gekocht
            </div>
          )}
        </div>
      )}
    </div>
  );
}
