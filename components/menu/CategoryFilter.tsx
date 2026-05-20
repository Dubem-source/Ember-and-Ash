"use client";

import { CATEGORIES } from "@/lib/data";

interface CategoryFilterProps {
  active: string;
  onChange: (id: string) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        paddingBottom: "8px",
        scrollbarWidth: "none",
      }}
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          style={{
            padding: "8px 18px",
            borderRadius: "100px",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
            cursor: "pointer",
            transition: "all 0.2s",
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
