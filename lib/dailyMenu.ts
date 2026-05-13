import { LUNCH_RECIPES, DINNER_RECIPES } from "./recipes";
import type { Recipe } from "@/types";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function dateToSeed(dateStr: string): number {
  return dateStr.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function shuffleWithSeed<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getDailyRecipes(
  dateStr: string,
  lunchOffset = 0,
  dinnerOffset = 0
): { lunch: Recipe[]; dinner: Recipe[] } {
  const seed = dateToSeed(dateStr);
  const rand = seededRandom(seed);

  const shuffledLunch = shuffleWithSeed(LUNCH_RECIPES, rand);
  const shuffledDinner = shuffleWithSeed(DINNER_RECIPES, rand);

  const lunchStart = (lunchOffset * 2) % LUNCH_RECIPES.length;
  const dinnerStart = (dinnerOffset * 2) % DINNER_RECIPES.length;

  const lunch = [
    shuffledLunch[lunchStart % shuffledLunch.length],
    shuffledLunch[(lunchStart + 1) % shuffledLunch.length],
  ];

  const dinner = [
    shuffledDinner[dinnerStart % shuffledDinner.length],
    shuffledDinner[(dinnerStart + 1) % shuffledDinner.length],
  ];

  return { lunch, dinner };
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}
