'use client';

import React, { useEffect, useState } from 'react';
import { Promo } from '@/app/db/types/promo';  // Ensure the correct path for Promo
import { Voucher } from '@/app/db/types/voucher';  // Ensure the correct path for Voucher
import '@/app/styles/diskon.css';
const DiskonPage = () => {
  // Explicitly define types for promos and vouchers
  const [promos, setPromos] = useState<Promo[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call the API route to fetch data
        const response = await fetch('/api/promo');
        const data = await response.json();
        
        console.log("Fetched Promos:", data.promos);
        console.log("Fetched Vouchers:", data.vouchers);

        setPromos(data.promos);
        setVouchers(data.vouchers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="diskon-container">
      <h1>Diskon - Promo dan Voucher</h1>
      
      <h2>Voucher</h2>
      {/* Display a message if no vouchers are found */}
      {vouchers.length > 0 ? (
        <div className="voucher-list">
          {vouchers.map((voucher, index) => (
            <div key={voucher.kode || index} className="voucher-item"> {/* Use voucher.kode or index */}
              <p><strong>Kode:</strong> {voucher.kode}</p>
              <p><strong>Harga:</strong> {voucher.harga}</p>
              <p><strong>Hari berlaku:</strong> {voucher.jmlHariBerlaku}</p>
              <p><strong>Kuota:</strong> {voucher.kuotaPenggunaan}</p>
              <button className="buy-voucher-btn">Beli Voucher</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No voucher data available.</p>
      )}
      <h2>Promo</h2>
      {/* Display a message if no promos are found */}
      {promos.length > 0 ? (
        <div className="promo-list">
          {promos.map((promo, index) => {
            // Ensure promo.tglAkhirBerlaku is a valid Date object
            const promoEndDate = new Date(promo.tglAkhirBerlaku);
            const validPromoEndDate = !isNaN(promoEndDate.getTime()) ? promoEndDate.toUTCString() : 'Invalid date';

            return (
              <div key={promo.kode || index} className="promo-item"> {/* Use promo.kode or index */}
                <p><strong>Kode:</strong> {promo.kode}</p>
                <p><strong>Nama:</strong> {validPromoEndDate}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No promo data available.</p>
      )}
      
      
    </div>
  );
};

export default DiskonPage;
