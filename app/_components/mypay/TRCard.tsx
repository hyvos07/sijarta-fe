// path : sijarta-fe/app/_components/mypay/TRCard.tsx

import { TrMyPay } from "@/src/db/types/trMypay"

export default function TRCard({ tgl, nominal, kategori }: TrMyPay & { kategori: string }) {
    const date = new Date(tgl).toLocaleDateString('id-ID')
    const incoming = (kategori === "TopUp MyPay" || kategori === "Terima honor" || (kategori === "Transfer MyPay" && nominal > 0))
    
    return (
        <div className="px-6 py-4 bg-black rounded-lg shadow-md border border-gray-700 flex justify-between transform transition-transform duration-200 hover:scale-[1.01]">
            <div className="flex flex-col justify-center">
                <p className="font-semibold mb-1 md:max-w-none max-w-40">{kategori}</p>
                <p className="text-sm text-gray-400">{new Date(tgl).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <p className={"flex font-semibold justify-center items-center" + ` ${incoming ? 'text-green-500' : 'text-red-500'}`}>{incoming ? '+' : '-'}Rp {Math.abs(nominal).toLocaleString('id-ID')}</p>
        </div>
    )
}