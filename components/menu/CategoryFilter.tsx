"use client";

import { CATEGORIES } from "@/lib/data";

interface CategoryFilterProps {
  active: string;
  onChange: (id: string) => void;
}

export default function CategoryFilter({
  active,
  onChange,
}: CategoryFilterProps) {
  return (
    <div
      className="flex w-full max-w-full flex-wrap gap-2 overflow-x-hidden pb-2 sm:flex-nowrap sm:overflow-x-auto"
      style={{
        scrollbarWidth: "none",
      }}
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-semibold transition-all sm:px-4"
          style={{
            cursor: "pointer",
            border: active === cat.id ? "none" : "1px solid #3D3028",
            background: active === cat.id ? "#E8541A" : "transparent",
            color: active === cat.id ? "white" : "#8A7566",
          }}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
