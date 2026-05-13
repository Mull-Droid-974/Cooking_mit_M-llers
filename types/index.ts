export type MealCategory = "lunch" | "dinner";

export type Recipe = {
  id: string;
  title: string;
  description: string;
  category: MealCategory;
  tags: string[];
  prepTime: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  emoji: string;
  calories?: number;
  protein?: number;
};

export type FamilyMember = "Susanne" | "Roman" | "Janis" | "Jeannie" | "Ramon";

export const FAMILY_MEMBERS: FamilyMember[] = ["Susanne", "Roman", "Janis", "Jeannie", "Ramon"];

export type FamilyRating = {
  [K in FamilyMember]?: number;
};

export type SavedRecipe = {
  recipeId: string;
  savedAt: string;
  cookedAt?: string;
  photos: string[];
  familyRatings: FamilyRating;
  notes?: string;
};

export type AppState = {
  bookmarks: SavedRecipe[];
  cooked: SavedRecipe[];
  dailyRefresh: {
    date: string;
    lunchOffset: number;
    dinnerOffset: number;
  };
};
