"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  rating?: number;
  onRate?: (stars: number) => void;
  size?: number;
  readonly?: boolean;
};

export default function StarRating({ rating = 0, onRate, size = 20, readonly = false }: Props) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRate?.(star)}
          className={cn(
            "transition-transform",
            !readonly && "active:scale-125 cursor-pointer",
            readonly && "cursor-default"
          )}
          style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Star
            size={size}
            className={cn(
              "transition-colors",
              star <= rating ? "fill-amber-400 text-amber-400" : "fill-none text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}
