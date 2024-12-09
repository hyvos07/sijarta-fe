'use client';

import React, { useEffect, useState } from 'react';
import { Promo } from '@/src/db/types/promo';
import { Voucher } from '@/src/db/types/voucher';
import '@/app/_styles/diskon.css';
import NavBar from '../_components/NavBar';
import { useRouter } from 'next/navigation'; // Import router untuk redirect
import { User } from '@/src/db/types/user';

const DiskonPage = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [ownedVouchers, setOwnedVouchers] = useState<string[]>([]); // Menyimpan voucher yang sudah dimiliki
  const [modalContent, setModalContent] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<number>(50000);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [userData, setDataUser] = useState<User | null>(null);
  const [currentPromoPage, setCurrentPromoPage] = useState<number>(1);
  const [currentVoucherPage, setCurrentVoucherPage] = useState<number>(1);
  const [role, setRole] = useState<'pelanggan' | 'pekerja' | null>(null); // Tambahkan state role
  const [error, setError] = useState<string | null>(null); // Tambahkan state error
  const itemsPerPage = 5;
  const router = useRouter(); // Inisialisasi router
  const [userID, setUserID] = useState<string | null>(null);

  // Fetch role data
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user');
  
        if (!response.ok) {
          setError(`Error ${response.status}: ${response.statusText}`);
          return;
        }
  
        const data = await response.json();
  
        if (data.role) {
          setRole(data.role);
          // Jika role bukan pelanggan, lakukan redirect
          if (data.role !== 'pelanggan') {
            window.alert('Role bukan pelanggan. Redirect ke halaman utama.');
            router.push('/'); // Redirect jika bukan pelanggan
          }
        } else {
          setError('Data pengguna tidak valid');
        }
  
        // Ambil nilai saldo_mypay dan set ke userBalance
        if (data.data.mypayBalance) {
          setUserBalance(parseFloat(data.data.mypayBalance)); // Mengupdate userBalance dengan saldo_mypay
        } else {
          setError('Saldo MyPay tidak ditemukan');
        }
        const userID = data.data.userID; 
        setUserID(userID);
      } catch (error: any) {
        console.error('Error fetching user data:', error.message);
        setError('Gagal mengambil data pengguna');
      }
    }
  
    fetchUserData();
  }, [router]);

  // Fetch promo, voucher, dan voucher yang sudah dimiliki
  useEffect(() => {
    const fetchData = async () => {
      if (!userID) return; // Pastikan userID sudah ada sebelum melakukan fetch

      try {
        // Mengambil data promo, voucher yang sudah dimiliki, dan user
        const [promoResponse, ownedVoucherResponse] = await Promise.all([
          fetch('/api/promo'),
          fetch(`/api/tr_pembelian_voucher?userID=${userID}`), // Menggunakan userID di URL dengan template string
        ]);

        const [promoData, ownedVoucherData] = await Promise.all([ 
          promoResponse.json(),
          ownedVoucherResponse.json(),
        ]);

        // Memasukkan data promo dan voucher yang sudah dimiliki ke dalam state
        setPromos(promoData.promos);
        setVouchers(promoData.vouchers); // Voucher sudah tersedia di dalam data promo
  
        // Jika ownedVoucherData.vouchers undefined atau null, set array kosong
        setOwnedVouchers(ownedVoucherData?.vouchers?.map((voucher: Voucher) => voucher.kode) || []);
        
        setDataUser(userData); // Tetap menyimpan data user jika diperlukan
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Gagal mengambil data promo atau voucher');
      }
    };
  
    fetchData();
  }, [userID]);
  // Pagination logic tetap
  const totalPromoPages = Math.ceil(promos.length / itemsPerPage);
  const totalVoucherPages = Math.ceil(vouchers.length / itemsPerPage);

  const currentPromos = promos.slice(
    (currentPromoPage - 1) * itemsPerPage,
    currentPromoPage * itemsPerPage
  );
  const currentVouchers = vouchers.slice(
    (currentVoucherPage - 1) * itemsPerPage,
    currentVoucherPage * itemsPerPage
  );

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
      const newBalance = userBalance - voucher.harga;
      setUserBalance(newBalance);
      setModalTitle('SUKSES');
      setModalContent(
        `Selamat! Anda berhasil membeli voucher kode ${voucher.kode}. Voucher ini berlaku selama ${voucher.jmlHariBerlaku} hari dengan kuota penggunaan sebanyak ${voucher.kuotaPenggunaan} kali. Sisa saldo Anda: Rp${newBalance}.`
      );
    } else {
      setModalTitle('GAGAL');
      setModalContent(
        `Gagal membeli voucher ${voucher.kode}. Saldo Anda tidak mencukupi. Anda membutuhkan Rp${voucher.harga - userBalance
        } lebih untuk membeli voucher ini.`
      );
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <NavBar />
      <div className="diskon-container text-white mx-4 mb-16">
        <h1 className="font-semibold my-4">Diskon - Promo dan Voucher</h1>

        <h2 className="font-semibold my-6">Voucher</h2>
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
                {ownedVouchers.includes(voucher.kode) ? (
                  <button className="owned-voucher-btn" disabled>
                    Sudah Pernah Dibeli
                  </button>
                ) : (
                  <button
                    className="buy-voucher-btn"
                    onClick={() => handleBuyVoucher(voucher)}
                  >
                    Beli Voucher
                  </button>
                )}
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
        <h2 className='font-semibold my-6 mt-14'>Promo</h2>
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
              <h3 className="font-semibold">{modalTitle}</h3>
              <p>{modalContent}</p>
              <button className="close-modal-btn" onClick={closeModal}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiskonPage;
