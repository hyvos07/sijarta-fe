import { NextResponse } from "next/server";

const categories = [
  {
    id: 1,
    name: "Kategori Jasa 1",
    subcategories: [
      { id: 1, name: "Subkategori Jasa 1" },
      { id: 2, name: "Subkategori Jasa 2" },
      { id: 3, name: "Subkategori Jasa 3" },
    ],
  },
  {
    id: 2,
    name: "Kategori Jasa 2",
    subcategories: [
      { id: 4, name: "Subkategori Jasa 1" },
      { id: 5, name: "Subkategori Jasa 2" },
      { id: 6, name: "Subkategori Jasa 3" },
    ],
  },
  {
    id: 3,
    name: "Kategori Jasa 3",
    subcategories: [
      { id: 7, name: "Subkategori Jasa 1" },
      { id: 8, name: "Subkategori Jasa 2" },
      { id: 9, name: "Subkategori Jasa 3" },
    ],
  },
];

// API untuk mengambil semua kategori dan subkategori
export async function GET() {
  return NextResponse.json(categories);
}