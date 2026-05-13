"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bookmark, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Heute", icon: Home },
  { href: "/vormerken", label: "Vormerken", icon: Bookmark },
  { href: "/favoriten", label: "Gekocht", icon: ChefHat },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-3 min-h-[56px] transition-colors",
                active ? "text-green-600" : "text-gray-400 active:text-gray-600"
              )}
            >
              <Icon
                size={22}
                className={cn("transition-all", active && "stroke-[2.5]")}
              />
              <span
                className={cn(
                  "text-[11px] font-medium",
                  active ? "text-green-600" : "text-gray-400"
                )}
              >
                {label}
              </span>
              {active && (
                <span className="absolute bottom-0 h-0.5 w-12 rounded-full bg-green-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
