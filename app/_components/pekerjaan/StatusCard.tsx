// path : sijarta-fe/app/_components/pekerjaan/StatusCard.tsx

'use client'
import { useState } from 'react';

export default function StatusCard({ pesanan }: { pesanan: any }) {
    const [status, setStatus] = useState(pesanan.status);

    const handleStatus = async () => {
        if (status === 'Pesanan Selesai' || status === 'Pesanan Dibatalkan') return;

        if (status === 'Pekerja Tiba Di Lokasi') {
            setStatus('Pelayanan Jasa Sedang Dilakukan');
        } else if (status === 'Pelayanan Jasa Sedang Dilakukan') {
            setStatus('Pesanan Selesai');
        } else {
            setStatus('Pekerja Tiba Di Lokasi');
        }
    }

    const decideColor = () => {
        if (status === 'Menunggu Pekerja Berangkat') return 'text-yellow-500';
        if (status === 'Pekerja Tiba Di Lokasi') return 'text-blue-500';
        if (status === 'Pelayanan Jasa Sedang Dilakukan') return 'text-yellow-500';
        if (status === 'Pesanan Selesai') return 'text-green-500';
        if (status === 'Pesanan Dibatalkan') return 'text-red-500';
    }

    return (
        <div className="flex w-full md:w-[800px] py-8 px-8 my-3 border border-zinc-700 bg-zinc-900 rounded-lg">
            <div className="flex flex-col w-full items-center">
                <p className={`${decideColor()}` + " text-lg font-medium self-start mb-6"}>{status}</p>
                <div className="flex md:flex-row flex-col w-full justify-between">
                    <div className="justify-start">
                        <p className="text-2xl font-semibold">{pesanan.subkategori}</p>
                        <p className="md:mt-1 mt-2 text-zinc-300 font-semibold">{pesanan.pelanggan?.nama ?? 'Anonim'} <span className="text-zinc-500 text-sm px-1">via {pesanan.metodeBayar}</span></p>
                    </div>
                    <p className="text-green-500 text-xl font-semibold md:my-0 my-3 md:px-2">Rp {pesanan.totalBiaya.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex flex-col text-left w-full my-2 md:mb-0 mb-8">
                    <p className="text-zinc-300 text-sm mt-2 font-semibold">Tanggal Pemesanan: <span className='font-medium px-1'>{new Date(pesanan.tglPemesanan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                    <p className="text-zinc-300 text-sm mt-2 font-semibold">Tanggal Pekerjaan: <span className='font-medium px-1'>{new Date(pesanan.tglPekerjaan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                </div>
                {status !== 'Pesanan Selesai' && status !== 'Pesanan Dibatalkan' && 
                    <button id={pesanan.id.toString()} className="self-end bg-zinc-100 text-black rounded-md mt-8 py-2 px-6 hover:bg-white font-medium" onClick={handleStatus}>
                        {status === 'Pekerja Tiba Di Lokasi' && 'Kerjakan'}
                        {status === 'Pelayanan Jasa Sedang Dilakukan' && 'Selesai'}
                        {status !== 'Menunggu Pekerja Berangkat' && status !== 'Pekerja Tiba Di Lokasi' && status !== 'Pelayanan Jasa Sedang Dilakukan' && 'Sudah Tiba'}
                    </button>
                }
            </div>
        </div>
    );
}