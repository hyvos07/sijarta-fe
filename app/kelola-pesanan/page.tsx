// path : sijarta-fe/app/kelola-pesanan/page.tsx

'use client';

import React, { useState, useEffect } from "react";
import { Pemesanan } from "@/src/db/types/pemesanan";
import { getPemesanan, updatePemesanan } from "@/src/db/models/pemesanan";
import NavBar from "../_components/NavBar";

const PemesananJasaPage: React.FC = () => {
  const [pemesanan, setPemesanan] = useState<Pemesanan[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");

  useEffect(() => {
    fetchPemesanan();
  }, []);

  const fetchPemesanan = async () => {
    const data = await getPemesanan();
    setPemesanan(data);
  };

  const handleCancel = async (id: number) => {
    await updatePemesanan(id, { status: "Dibatalkan" });
    fetchPemesanan();
  };

  const handleTestimony = async (id: number) => {
    await updatePemesanan(id, { sudahMemberiTestimoni: true });
    fetchPemesanan();
  };

  const filteredPemesanan = pemesanan.filter(
    (item) => filterStatus === "" || item.status === filterStatus
  );

  return (
    <>
      <NavBar />
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">View Pemesanan Jasa</h2>

        {/* Filter Dropdown */}
        <div className="mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-60 text-black"
          >
            <option value="">Semua Status</option>
            <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
            <option value="Pesanan Selesai">Pesanan Selesai</option>
            <option value="Mencari Pekerja Terdekat">Mencari Pekerja Terdekat</option>
          </select>
        </div>

        {/* Pemesanan Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Subkategori</th>
                <th className="px-4 py-2 border-b">Sesi Layanan</th>
                <th className="px-4 py-2 border-b">Harga</th>
                <th className="px-4 py-2 border-b">Nama Pekerja</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPemesanan.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border-b">{item.subkategori}</td>
                  <td className="px-4 py-2 border-b">{item.sesiLayanan}</td>
                  <td className="px-4 py-2 border-b">Rp {item.harga.toLocaleString()}</td>
                  <td className="px-4 py-2 border-b">{item.namaPekerja}</td>
                  <td className="px-4 py-2 border-b">{item.status}</td>
                  <td className="px-4 py-2 border-b">
                    {item.status === "Menunggu Pembayaran" ||
                    item.status === "Mencari Pekerja Terdekat" ? (
                      <button
                        onClick={() => handleCancel(item.id)}
                        className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                      >
                        Batalkan
                      </button>
                    ) : item.status === "Pesanan Selesai" && !item.sudahMemberiTestimoni ? (
                      <button
                        onClick={() => handleTestimony(item.id)}
                        className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                      >
                        Buat Testimoni
                      </button>
                    ) : (
                      <span>Tidak Ada Aksi</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PemesananJasaPage;
