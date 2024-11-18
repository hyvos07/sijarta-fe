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

  const [currentPromoPage, setCurrentPromoPage] = useState<number>(1); // Promo pagination
  const [currentVoucherPage, setCurrentVoucherPage] = useState<number>(1); // Voucher pagination
  const itemsPerPage = 5; // Number of items per page

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

  // Total pages for promo and voucher
  const totalPromoPages = Math.ceil(promos.length / itemsPerPage);
  const totalVoucherPages = Math.ceil(vouchers.length / itemsPerPage);

  // Get current page data for promo and voucher
  const currentPromos = promos.slice(
    (currentPromoPage - 1) * itemsPerPage,
    currentPromoPage * itemsPerPage
  );
  const currentVouchers = vouchers.slice(
    (currentVoucherPage - 1) * itemsPerPage,
    currentVoucherPage * itemsPerPage
  );

  // Pagination handlers for promo
  const nextPromoPage = () => {
    if (currentPromoPage < totalPromoPages) {
      setCurrentPromoPage(currentPromoPage + 1);
    }
  };

  const prevPromoPage = () => {
    if (currentPromoPage > 1) {
      setCurrentPromoPage(currentPromoPage - 1);
    }
  };

  // Pagination handlers for voucher
  const nextVoucherPage = () => {
    if (currentVoucherPage < totalVoucherPages) {
      setCurrentVoucherPage(currentVoucherPage + 1);
    }
  };

  const prevVoucherPage = () => {
    if (currentVoucherPage > 1) {
      setCurrentVoucherPage(currentVoucherPage - 1);
    }
  };

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

        {/* Voucher Section */}
        <h2>Voucher</h2>
        {currentVouchers.length > 0 ? (
          <div className="voucher-list">
            {currentVouchers.map((voucher, index) => (
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

        <div className="pagination-controls">
          <button onClick={prevVoucherPage} disabled={currentVoucherPage === 1}>
            Previous
          </button>
          <span>
            Halaman {currentVoucherPage} dari {totalVoucherPages}
          </span>
          <button
            onClick={nextVoucherPage}
            disabled={currentVoucherPage === totalVoucherPages}
          >
            Next
          </button>
        </div>

        {/* Promo Section */}
        <h2>Promo</h2>
        {currentPromos.length > 0 ? (
          <div className="promo-list">
            {currentPromos.map((promo, index) => {
              const promoEndDate = new Date(promo.tglAkhirBerlaku);
              const validPromoEndDate = !isNaN(promoEndDate.getTime())
                ? promoEndDate.toUTCString()
                : 'Invalid date';

              return (
                <div key={promo.kode || index} className="promo-item">
                  <p>Promo: {promo.kode}</p>
                  <p>
                    <strong>Tanggal Expired:</strong> {validPromoEndDate}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Tidak ada promo tersedia.</p>
        )}

        <div className="pagination-controls">
          <button onClick={prevPromoPage} disabled={currentPromoPage === 1}>
            Previous
          </button>
          <span>
            Halaman {currentPromoPage} dari {totalPromoPages}
          </span>
          <button
            onClick={nextPromoPage}
            disabled={currentPromoPage === totalPromoPages}
          >
            Next
          </button>
        </div>

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
