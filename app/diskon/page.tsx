// path : sijarta-fe/app/diskon/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Promo } from '@/src/db/types/promo';
import { Voucher } from '@/src/db/types/voucher';
import '@/app/_styles/diskon.css';
import NavBar from '../_components/NavBar';
import { useRouter } from 'next/navigation';
import { User } from '@/src/db/types/user';
import { MetodeBayar } from '@/src/db/types/metodeBayar';

const DiskonPage = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [ownedVouchers, setOwnedVouchers] = useState<string[]>([]);
  const [metodeBayar, setMetodeBayar] = useState<MetodeBayar[]>([]);
  const [modalContent, setModalContent] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<number>(50000);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [userData, setDataUser] = useState<User | null>(null);
  const [currentPromoPage, setCurrentPromoPage] = useState<number>(1);
  const [currentVoucherPage, setCurrentVoucherPage] = useState<number>(1);
  const [role, setRole] = useState<'pelanggan' | 'pekerja' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetodeBayar, setSelectedMetodeBayar] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const itemsPerPage = 5;
  const router = useRouter();
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
        const [promoResponse, ownedVoucherResponse, metodeBayarResponse] = await Promise.all([
          fetch('/api/promo'),
          fetch(`/api/tr_pembelian_voucher?userID=${userID}`), 
          fetch('/api/metode_bayar'),
        ]);

        const [promoData, ownedVoucherData, metodeBayarData] = await Promise.all([ 
          promoResponse.json(),
          ownedVoucherResponse.json(),
          metodeBayarResponse.json(),
        ]);

        // Memasukkan data promo dan voucher yang sudah dimiliki ke dalam state
        setPromos(promoData.promos);
        setVouchers(promoData.vouchers);
        setMetodeBayar(metodeBayarData.metodeBayar);
        // Jika ownedVoucherData.vouchers undefined atau null, set array kosong
        setOwnedVouchers(ownedVoucherData?.vouchers?.map((voucher: Voucher) => voucher.kode) || []);
        
        setDataUser(userData);
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
    // Instead of immediately showing the modal, set the voucher and open method selection modal
    setSelectedVoucher(voucher);
    setSelectedMetodeBayar(null); // Reset selected method
    setModalTitle('Pilih Metode Bayar');
    setModalContent('select_method');
    setIsModalOpen(true);
  };

  const handleMethodSelect = async () => {
    if (!selectedMetodeBayar) {
      window.alert('Silakan pilih metode pembayaran');
      return;
    }
  
    const selectedMethod = metodeBayar.find(m => m.id === selectedMetodeBayar);
  
    if (selectedVoucher) {
      // Prepare data to send to the transaction API
      const body = {
        jumlahHari: selectedVoucher.jmlHariBerlaku,
        idPelanggan: userID,
        idVoucher: selectedVoucher.kode,
        idMetodeBayar: selectedMetodeBayar,
        hargaVoucher: selectedVoucher.harga
      };
  
      try {
        // If payment method is MyPay, update balance first
        if (selectedMethod?.nama === 'MyPay') {
          if (userBalance < selectedVoucher.harga) {
            setModalTitle('GAGAL');
            setModalContent(
              `Gagal membeli voucher ${selectedVoucher.kode}. 
              Saldo Anda tidak mencukupi. Anda membutuhkan Rp${selectedVoucher.harga - userBalance} 
              lebih untuk membeli voucher ini.`
            );
            setIsModalOpen(true);
            return;
          }
  
          // Call API to update balance for MyPay
          const balanceResponse = await fetch('/api/update_duit_tr_pesan_voucher', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
  
          if (!balanceResponse.ok) {
            throw new Error('Gagal memperbarui saldo');
          }
  
          // Update local balance
          const newBalance = userBalance - selectedVoucher.harga;
          setUserBalance(newBalance);
        }
  
        // Proceed with voucher transaction
        const response = await fetch('/api/tr_pembelian_voucher', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          setModalTitle('SUKSES');
          setModalContent(
            selectedMethod?.nama === 'MyPay'
              ? `Selamat! Anda berhasil membeli voucher kode ${selectedVoucher.kode}. 
                 Saldo MyPay Anda berkurang Rp${selectedVoucher.harga}. 
                 Sisa saldo: Rp${userBalance - selectedVoucher.harga}.`
              : `Selamat! Anda berhasil membeli voucher kode ${selectedVoucher.kode} 
                 dengan metode bayar ${selectedMethod?.nama}.`
          );
        } else {
          throw new Error(result.error || 'Gagal menambahkan transaksi');
        }
      } catch (error) {
        console.error('Error saat memproses transaksi:', error);
        setModalTitle('GAGAL');
        setModalContent('Terjadi kesalahan saat memproses transaksi.');
      }
  
      // Reset selected voucher
      setSelectedVoucher(null);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMetodeBayar(null);
    setSelectedVoucher(null);
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
              
              {modalContent === 'select_method' ? (
                <div>
                  <select 
                    value={selectedMetodeBayar || ''}
                    onChange={(e) => setSelectedMetodeBayar(e.target.value)}
                    className="w-full p-2 mb-4"
                    style={{color: "black"}}
                  >
                    <option value="">Pilih Metode Pembayaran</option>
                    {metodeBayar.map((metode) => (
                      <option key={metode.id} value={metode.id} style={{color: "black"}}>
                        {metode.nama}
                      </option>
                    ))}
                  </select>
                  <button 
                    className="buy-voucher-btn w-full"
                    onClick={handleMethodSelect}
                    disabled={!selectedMetodeBayar}
                  >
                    Konfirmasi
                  </button>
                </div>
              ) : (
                <>
                  <p>{modalContent}</p>
                  <button className="close-modal-btn" onClick={closeModal}>
                    OK
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiskonPage;