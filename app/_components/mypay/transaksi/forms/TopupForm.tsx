// path : sijarta-fe/app/_components/mypay/transaksi/forms/TopupForm.tsx

"use client"
import CircularLoading from "@/app/_components/CircularLoading";
import { useState } from "react";

export default function TopupForm({updateSaldo}: {updateSaldo: (nominal: number) => void}) {
    const [loading, setLoading] = useState(false);
    const [successNotification, setSuccessNotification] = useState(false);
    const [failedNotification, setFailedNotification] = useState(false);
    const [failedMessage, setFailedMessage] = useState('Silahkan coba lagi');
    
    const [nominal, setNominal] = useState(-1);

    async function handleTopup() {
        if (Number.isNaN(nominal) || nominal < 1 || nominal > 1000000000 || !Number.isInteger(nominal)) {
            setFailedMessage(
                Number.isNaN(nominal) ? 'Nominal bukan sebuah angka' :
                nominal < 1 || nominal > 1000000000 ? 'Nominal tidak valid' :
                'Nominal harus berupa bilangan bulat positif'
            );
            showNotification(false);
            return;
        }

        setLoading(true);

        const response = await fetch('/api/tr-mypay/topup', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: new Date().toLocaleString('id-ID', {
                    timeZone: 'Asia/Jakarta',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).split('/').reverse().join('-'),
                nominal: nominal
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
    
        updateSaldo(nominal);   // Update saldo locally first
        setNominal(-1);
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

    return (
        <>
            <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-3 bg-green-600 text-white rounded-md shadow-lg transition-transform duration-500 ease-in-out ${successNotification ? 'translate-y-24' : '-translate-y-full'}`} style={{ zIndex: 99 }}>
                <span className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Topup Berhasil
                </span>
            </div>
            <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-3 bg-red-600 text-white rounded-md shadow-lg transition-transform duration-500 ease-in-out ${failedNotification ? 'translate-y-24' : '-translate-y-full'}`} style={{ zIndex: 99 }}>
                <span className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Topup Gagal. {failedMessage}.
                </span>
            </div>
            <div className="flex flex-col md:my-2 my-6">
                <p className="text-lg font-semibold my-3">Nominal</p>
                <input type="number" id="nominal" name="nominal" value={Number.isNaN(nominal) ? '' : nominal < 0 ? '' : nominal} onChange={(e) => setNominal(parseInt(e.target.value))} step="1" min="0"
                    className="py-3 px-3 border border-gray-600 rounded-lg bg-transparent text-base focus:outline focus:outline-blue-500 
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    onKeyDown={(e) => {if (e.key === '.' || e.key === 'e' || e.key === '-') e.preventDefault();}}
                />
                <div className="flex md:justify-end mt-10 md:mt-8" >
                    <button
                        type="submit"
                        className="md:w-36 w-full py-3 bg-zinc-100 text-black font-semibold rounded-2xl shadow-lg hover:bg-white"
                        onClick={(e) => { e.preventDefault(); if(!loading) handleTopup(); }}
                    >
                        {loading ? <CircularLoading black={true} size={`6`} /> : 'Topup'}
                    </button>
                </div>
            </div>
        </>
    );
}