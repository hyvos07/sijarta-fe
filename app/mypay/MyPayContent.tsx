'use client';
import { useState, useEffect } from 'react';
import { User } from '@/app/db/types/user';
import { TrMyPay } from '@/app/db/types/trMypay';
import CircularLoading from "../components/CircularLoading";
import TRCard from "../components/mypay/TRCard";
import { kategoriTrMyPayService } from '@/app/db/services/kategoriTrMypay';
import InfoCard from '../components/mypay/InfoCard';

interface MyPayContentProps {
    user: User;
    transaksi: TrMyPay[];
    saldoMyPay: number;
}

export default function MyPayContent({ user, transaksi, saldoMyPay }: MyPayContentProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const fetchKategori = async () => {
            try {
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
    }, [transaksi]);

    return (
        <div className="mx-4 md:mx-12 my-6 mb-8 md:p-4 p-2">
            {/* <button className="text-white py-4 rounded mb-6" onClick={() => { window.location.href = '/'; }}>
                ⟵ &nbsp; Back
            </button> */}
            <h1 className="text-2xl md:text-4xl font-semibold mb-12">
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