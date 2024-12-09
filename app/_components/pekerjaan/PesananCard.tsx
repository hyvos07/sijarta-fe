import { useState } from 'react';
import CircularLoading from '../CircularLoading';

export default function PesananCard({ pesanan }: { pesanan: any }) {
    const [loading, setLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [taken, setTaken] = useState(false);
    const [isShrinking, setIsShrinking] = useState(false);

    const handleChangeStatus = async (e: any) => {
        setLoading(true);

        const id = e.target.id;
        console.log('Mengubah status pesanan dengan ID:', id);

        const response = await fetch('/api/pesanan', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idPesanan: pesanan.id,
                date: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }),
            })
        });

        setLoading(false);

        if (!response.ok) {
            console.error('Error changing status');
            return;
        }

        setIsShrinking(true);

        setTimeout(() => {
            setTaken(true);
            setIsShrinking(false);
        }, 300); // Duration of the shrinking animation

        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    }

    return (
        <div>
            { !taken && 
                <div className={`py-8 px-8 my-3 border border-zinc-700 bg-zinc-900 rounded-lg transition-all duration-300 ${isShrinking ? 'opacity-0 transform scale-75' : 'opacity-100'}`}>
                    <div className="flex flex-col w-full items-center">
                        <div className="flex md:flex-row flex-col w-full justify-between">
                            <div className="justify-start">
                                <p className="text-2xl font-semibold">{pesanan.subkategori}</p>
                                <p className="md:mt-1 mt-2 text-lg text-zinc-300 font-semibold">{pesanan.pelanggan?.nama ?? 'Anonim'} <span className="text-zinc-500 text-sm px-1">via {pesanan.metodeBayar}</span></p>
                            </div>
                            <p className="text-green-500 text-xl font-semibold md:my-0 my-3 md:px-2">Rp {pesanan.totalBiaya.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex flex-col text-left w-full my-2 md:mb-0 mb-8">
                            <p className="text-zinc-300 text-sm mt-2 font-semibold">Tanggal Pemesanan: <span className='font-medium px-1'>{new Date(pesanan.tglPemesanan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                            <p className="text-zinc-300 text-sm mt-2 font-semibold">Tanggal Pekerjaan: <span className='font-medium px-1'>{new Date(pesanan.tglPekerjaan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                        </div>
                        <button id={pesanan.id.toString()} className="self-end bg-zinc-100 text-black rounded-md py-2 px-6 hover:bg-white font-medium" onClick={handleChangeStatus}>
                            {loading ? <CircularLoading black={true} size='6' /> : 'Kerjakan Pesanan'}
                        </button>
                    </div>
                </div>
            }
            <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-3 bg-green-600 text-white rounded-md shadow-lg transition-transform duration-500 ease-in-out ${showNotification ? 'translate-y-24' : '-translate-y-full'}`} style={{ zIndex: 99 }}>
                <span className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Pesanan Diambil
                </span>
            </div>
        </div>
    );
}