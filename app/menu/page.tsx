"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { MENU_ITEMS } from "@/lib/data";
import MenuCard from "@/components/menu/MenuCard";
import CategoryFilter from "@/components/menu/CategoryFilter";

export default function MenuPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = MENU_ITEMS.filter((item) => {
    const matchCat = category === "all" || item.category === category;
    const matchSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  return (
    <div
      className="page-shell"
      style={{ paddingTop: "64px", minHeight: "100vh" }}
    >
      <div
        className="section-shell"
        style={{
          background: "#221C16",
          borderBottom: "1px solid #3D3028",
          padding: "48px 24px 32px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p className="section-label" style={{ marginBottom: "12px" }}>
            Fire-crafted dishes
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: "48px",
              fontWeight: 900,
              color: "#F5EDD8",
              marginBottom: "32px",
            }}
          >
            Our Menu
          </h1>
          <div
            style={{
              position: "relative",
              maxWidth: "480px",
              marginBottom: "24px",
            }}
          >
            <Search
              size={18}
              color="#8A7566"
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "44px" }}
            />
          </div>
          <CategoryFilter active={category} onChange={setCategory} />
        </div>
      </div>
      <div
        className="section-shell"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}
      >
        {filtered.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "80px 0", color: "#8A7566" }}
          >
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</p>
            <p
              className="font-display"
              style={{
                fontSize: "24px",
                color: "#F5EDD8",
                marginBottom: "8px",
              }}
            >
              Nothing found
            </p>
            <p>Try a different category or search term</p>
          </div>
        ) : (
          <>
            <p
              style={{
                fontSize: "13px",
                color: "#8A7566",
                marginBottom: "24px",
              }}
            >
              {filtered.length} {filtered.length === 1 ? "dish" : "dishes"}{" "}
              found
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {filtered.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
