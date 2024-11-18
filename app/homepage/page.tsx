'use client';

import React, { useState } from "react";

interface Subcategory {
  id: number;
  name: string;
  url: string;
}

interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

const categories: Category[] = [
  {
    id: 1,
    name: "Kategori Jasa 1",
    subcategories: [
      { id: 1, name: "Subkategori Jasa 1", url: "/subkategori/jasa-1" },
      { id: 2, name: "Subkategori Jasa 2", url: "/subkategori/jasa-2" },
      { id: 3, name: "Subkategori Jasa 3", url: "/subkategori/jasa-3" },
    ],
  },
  {
    id: 2,
    name: "Kategori Jasa 2",
    subcategories: [
      { id: 4, name: "Subkategori Jasa 1", url: "/subkategori/jasa-4" },
      { id: 5, name: "Subkategori Jasa 2", url: "/subkategori/jasa-5" },
      { id: 6, name: "Subkategori Jasa 3", url: "/subkategori/jasa-6" },
    ],
  },
  {
    id: 3,
    name: "Kategori Jasa 3",
    subcategories: [
      { id: 7, name: "Subkategori Jasa 1", url: "/subkategori/jasa-7" },
      { id: 8, name: "Subkategori Jasa 2", url: "/subkategori/jasa-8" },
      { id: 9, name: "Subkategori Jasa 3", url: "/subkategori/jasa-9" },
    ],
  },
];

const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>(
    []
  );

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setSelectedCategory(value || null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat.id === selectedCategory);
      if (category) {
        const filtered = category.subcategories.filter((subcat) =>
          subcat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSubcategories(filtered);
      }
    }
  };

  const handleSubcategoryClick = (name: string) => {
    const formattedName = name.toLowerCase().replace(/\s+/g, "-");
    const url = `/subkategori/${formattedName}`;
    window.location.href = url; 
  };

  const formatName = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="categoryDropdown">Kategori: </label>
        <select
          id="categoryDropdown"
          onChange={handleCategoryChange}
          value={selectedCategory || ""}
        >
          <option value="">Pilih Kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="searchBox">Nama Subkategori: </label>
        <input
          id="searchBox"
          type="text"
          placeholder="Cari subkategori..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchClick}>Cari</button>
      </div>

      <div>
        {selectedCategory && (
          <div>
            <h3>
              {categories.find((cat) => cat.id === selectedCategory)?.name}
            </h3>
            <ul>
              {filteredSubcategories.map((subcat) => (
                <li
                  key={subcat.id}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                  onClick={() => handleSubcategoryClick(subcat.name)}
                >
                  {formatName(subcat.name)} {/* Display the formatted name */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
