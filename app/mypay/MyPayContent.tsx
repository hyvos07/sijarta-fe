'use client';
import { useState, useEffect } from 'react';
import { User } from '@/app/db/types/user';
import { TrMyPay } from '@/app/db/types/trMypay';
import CircularLoading from "../components/CircularLoading";
import TRCard from "../components/mypay/TRCard";
import { kategoriTrMyPayService } from '@/app/db/services/kategoriTrMypay';

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
            <div className="flex px-8 py-8 rounded-[24px] border border-zinc-700 bg-zinc-900 mb-8 md:mb-12">
                <div className="flex flex-col md:flex-row justify-between items-center w-full">
                    <div className="flex w-full md:w-auto">
                        <div className="flex flex-col md:w-auto md:mb-0 mb-7 mr-16 w-full">
                            <h1 className="text-lg md:text-2xl font-semibold mb-2">
                                Nomor Hp
                            </h1>
                            <p className="text-lg font-semibold text-stone-300">
                                {user.noHP.slice(0, 4)}-{user.noHP.slice(4, 8)}-{user.noHP.slice(8)}
                            </p>
                        </div>
                        <div className="flex flex-col md:w-auto md:mb-0 mb-10 w-full hidden md:block">
                            <h1 className="text-lg md:text-2xl font-semibold mb-2">
                                Saldo MyPay
                            </h1>
                            <p className="text-lg text-green-500 font-semibold">
                                Rp {saldoMyPay.toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col md:w-auto md:mb-0 mb-10 w-full md:hidden">
                        <h1 className="text-lg md:text-2xl font-semibold mb-2">
                            Saldo MyPay
                        </h1>
                        <p className="text-lg text-green-500 font-semibold">
                            Rp {saldoMyPay.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <button className="bg-zinc-200 px-6 py-3 md:text-lg text-black font-semibold rounded" onClick={() => { window.location.href = '/mypay/transaksi'; }}>
                        Lakukan Transaksi
                    </button>
                </div>
            </div>
            <div className="pt-2">
                <h2 className="pl-1.5 text-xl md:text-2xl md:text-left text-center font-semibold mb-8">
                    Riwayat Transaksi
                </h2>
                {isLoading ? (
                    <CircularLoading size={10} />
                ) : (
                    <div className="flex flex-col gap-4">
                        {transactions}
                    </div>
                )}
            </div>
        </div>
    );
}