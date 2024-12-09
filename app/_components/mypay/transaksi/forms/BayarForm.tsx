// path : sijarta-fe/app/_components/mypay/transaksi/forms/BayarForm.tsx

"use client"
import CircularLoading from "@/app/_components/CircularLoading";
import { TrPemesananJasa } from "@/src/db/types/trPemesananJasa";
import { use, useEffect, useState } from "react";

export default function BayarForm({updateSaldo}: {updateSaldo: (nominal: number) => void}) {
    const [loading, setLoading] = useState(false);
    const [successNotification, setSuccessNotification] = useState(false);
    const [failedNotification, setFailedNotification] = useState(false);
    const [failedMessage, setFailedMessage] = useState('Silahkan coba lagi');

    const [idPesanan, setidPesanan] = useState("none");
    const [pesanan, setPesanan] = useState<any[]>([]);

    function onPesananChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setidPesanan(event.target.value);
    }

    async function handleBayar() {
        if (idPesanan === "none") {
            setFailedMessage('Pilih pesanan terlebih dahulu');
            showNotification(false);
            return;
        }

        setLoading(true);

        const response = await fetch('/api/tr-mypay/bayar', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }),
                idPesanan: idPesanan
            })
        });
    
        if (!response.ok) {
            const responseBody = await response.json();
            setFailedMessage(responseBody?.error || 'Unknown error');
            showNotification(false);
            setLoading(false);
            return;
        }

        setTimeout(() => {
            setLoading(false);
        }, 500);
    
        updateSaldo(-0);   // Update saldo locally first
        setidPesanan("none");

        showNotification(true);
    }

    function showNotification(success: boolean) {
        if (success) {
            setSuccessNotification(true);
            setTimeout(() => {
                setSuccessNotification(false);
            }, 2000);
        } else {
            setFailedNotification(true);
            setTimeout(() => {
                setFailedNotification(false);
            }, 2000);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/tr-mypay/tagihan', {
                method: 'GET',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
            });

            const data = await response.json();

            console.log(data);

            if (response.ok) {
                setPesanan(data.pesanan);
            } else {
                console.error('Error fetching pesanan:', data.error);
            }
        }

        fetchData();
    }, [successNotification == true]);

    return (
        <>
            <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-3 bg-green-600 text-white rounded-md shadow-lg transition-transform duration-500 ease-in-out ${successNotification ? 'translate-y-24' : '-translate-y-full'}`} style={{ zIndex: 99 }}>
                <span className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Pembayaran Berhasil
                </span>
            </div>
            <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-3 bg-red-600 text-white rounded-md shadow-lg transition-transform duration-500 ease-in-out ${failedNotification ? 'translate-y-24' : '-translate-y-full'}`} style={{ zIndex: 99 }}>
                <span className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Pembayaran Gagal. {failedMessage}.
                </span>
            </div>
            <div className="flex flex-col md:my-2 my-6">
                <p className="text-lg font-semibold my-3">Pesanan</p>
                <select id="pesanan" className="py-3 h-min bg-zinc-800 pl-4 border-r-[16px] border-zinc-800 outline outline-2 outline-zinc-700 rounded-xl" onChange={onPesananChange} value={idPesanan}>
                    <option value="none" className="text-sm md:text-base" disabled>Pilih Pesanan</option>
                    {
                        pesanan.map((p: any) => {
                            return (
                                <option value={p.id} key={p.id}>
                                    {p.namaSubkategori} - {new Date(p.tglPemesanan).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric'})}
                                </option>
                            );
                        })
                    }
                </select>
                <div className="flex w-full justify-between my-3 mt-6">
                    <p className="text-lg font-semibold">Total Biaya</p>
                    {idPesanan === "none" &&
                        <p className="text-lg font-semibold">Rp 0</p>
                    }
                    {idPesanan !== "none" &&
                        <p className="text-lg font-semibold">Rp {pesanan.find(p => p.id === idPesanan)?.totalBiaya}</p>
                    }
                </div>
                <div className="flex md:justify-end mt-10 md:mt-8" >
                    <button
                        type="submit"
                        className="md:w-36 w-full py-3 bg-zinc-100 text-black font-semibold rounded-2xl shadow-lg hover:bg-white"
                        onClick={(e) => { e.preventDefault(); if(!loading) handleBayar(); }}
                    >
                        {loading ? <CircularLoading black={true} size="6" /> : "Bayar"}
                    </button>
                </div>
            </div>
        </>
    );
}