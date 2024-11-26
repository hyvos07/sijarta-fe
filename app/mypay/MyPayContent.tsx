'use client';
import { useState, useEffect } from 'react';
import { User } from '@/src/db/types/user';
import { Convert } from '@/src/db/types/trMypay';
import CircularLoading from "../_components/CircularLoading";
import TRCard from "../_components/mypay/TRCard";
import { kategoriTrMyPayService } from '@/src/db/models/kategoriTrMypay';
import InfoCard from '../_components/mypay/InfoCard';

async function getAllTransaksi(id: string) {
    const response = await fetch(`/api/tr-mypay?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    return Convert.toTrMyPay(data.transaksi);
}

export default function MyPayContent({ user }: { user: User }) {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<JSX.Element[]>([]);
    
    const saldoMyPay = user?.saldoMyPay || 0;

    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const transaksi = await getAllTransaksi(user.id);
                const enrichedTransactions = await Promise.all(
                    transaksi.map(async (tr) => {
                        const kategori = await kategoriTrMyPayService.getKategoriById(tr.kategoriID);
                        return (
                            <TRCard tgl={tr.tgl} nominal={tr.nominal} kategori={kategori} key={tr.id} id={tr.id} userID={tr.userID} kategoriID={tr.kategoriID} />
                        );
                    })
                );
                setTransactions(enrichedTransactions);
            } catch (error) {
                console.error('Error fetching kategori:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchKategori();
    }, [user.id]);

    return (
        <div className="mx-4 md:mx-12 my-6 mb-8 p-4">
            {/* <button className="text-white py-4 rounded mb-6" onClick={() => { window.location.href = '/'; }}>
                ⟵ &nbsp; Back
            </button> */}
            <h1 className="text-3xl md:text-4xl font-semibold text-center mb-12">
                MyPay
            </h1>
            < InfoCard noHP={user.noHP} saldoMyPay={saldoMyPay} />
            <div className="pt-2">
                <h2 className="pl-1.5 text-xl md:text-2xl md:text-left text-center font-semibold mb-8">
                    Riwayat Transaksi
                </h2>
                {isLoading ? (
                    <CircularLoading />
                ) : (
                    <div className="flex flex-col gap-4">
                        {transactions}
                    </div>
                )}
            </div>
        </div>
    );
}