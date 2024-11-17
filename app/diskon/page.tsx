'use client';

import React, { useEffect, useState } from 'react';
import { Promo } from '@/app/db/types/promo'; // Ensure the correct path for Promo
import { Voucher } from '@/app/db/types/voucher'; // Ensure the correct path for Voucher
import '@/app/styles/diskon.css';
import NavBar from '../components/NavBar';

const DiskonPage = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [modalContent, setModalContent] = useState<string>(''); // Konten modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Status modal
  const [userBalance, setUserBalance] = useState<number>(50000);
  const [modalTitle, setModalTitle] = useState<string>(''); // Judul modal (SUKSES atau GAGAL)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/promo');
        const data = await response.json();

        setPromos(data.promos);
        setVouchers(data.vouchers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBuyVoucher = (voucher: Voucher) => {
    if (userBalance >= voucher.harga) {
      // Sukses membeli voucher
      const newBalance = userBalance - voucher.harga;
      setUserBalance(newBalance); // Kurangi saldo
      setModalTitle('SUKSES'); // Judul modal
      setModalContent(
        `Selamat! Anda berhasil membeli voucher kode ${voucher.kode}. Voucher ini berlaku selama ${voucher.jmlHariBerlaku} hari dengan kuota penggunaan sebanyak ${voucher.kuotaPenggunaan} kali. Sisa saldo Anda: Rp${newBalance}.`
      );
    } else {
      // Gagal membeli voucher
      setModalTitle('GAGAL'); // Judul modal
      setModalContent(
        `Gagal membeli voucher ${voucher.kode}. Saldo Anda tidak mencukupi. Anda membutuhkan Rp${
          voucher.harga - userBalance
        } lebih untuk membeli voucher ini.`
      );
    }
    setIsModalOpen(true); // Tampilkan modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Tutup modal
  };

  return (
    <>
      <NavBar />
      <div className="diskon-container">
        <h1>Diskon - Promo dan Voucher</h1>

        <h2>Voucher</h2>
        {vouchers.length > 0 ? (
          <div className="voucher-list">
            {vouchers.map((voucher, index) => (
              <div key={voucher.kode || index} className="voucher-item">
                <p>
                  <strong>Kode:</strong> {voucher.kode}
                </p>
                <p>
                  <strong>Harga:</strong> Rp{voucher.harga}
                </p>
                <p>
                  <strong>Hari berlaku:</strong> {voucher.jmlHariBerlaku}
                </p>
                <p>
                  <strong>Kuota:</strong> {voucher.kuotaPenggunaan}
                </p>
                <button
                  className="buy-voucher-btn"
                  onClick={() => handleBuyVoucher(voucher)}
                >
                  Beli Voucher
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No voucher data available.</p>
        )}

        <h2>Promo</h2>
        {promos.length > 0 ? (
          <div className="promo-list">
            {promos.map((promo, index) => {
              const promoEndDate = new Date(promo.tglAkhirBerlaku);
              const validPromoEndDate = !isNaN(promoEndDate.getTime())
                ? promoEndDate.toUTCString()
                : 'Invalid date';

              return (
                <div key={promo.kode || index} className="promo-item">
                  <p>
                    <strong>Kode:</strong> {promo.kode}
                  </p>
                  <p>
                    <strong>Tanggal Expired:</strong> {validPromoEndDate}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No promo data available.</p>
        )}

        {/* Modal Notifikasi */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{modalTitle}</h3>
              <p>{modalContent}</p>
              <button className="close-modal-btn" onClick={closeModal}>
                Button Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DiskonPage;
