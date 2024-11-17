import { TrMyPay } from "@/app/db/types/trMypay"
import { kategoriTrMyPayService } from "@/app/db/services/kategoriTrMypay"

export default function TRCard({ tgl, nominal, kategori }: TrMyPay & { kategori: string }) {
    const date = new Date(tgl).toLocaleDateString('id-ID')
    const incoming = (kategori === "TopUp MyPay" || kategori === "Terima honor")
    
    return (
        <div className="px-6 py-4 bg-black rounded-lg shadow-md border border-gray-700 flex justify-between transform transition-transform duration-200 hover:scale-[1.01]">
            <div className="flex flex-col justify-center">
                <p className="font-semibold mb-1 md:max-w-none max-w-40">{kategori}</p>
                <p className="text-sm text-gray-400">{new Date(tgl).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <p className={"flex font-bold justify-center items-center" + ` ${incoming ? 'text-green-500' : 'text-red-500'}`}>{incoming ? '+' : '-'}Rp {nominal.toLocaleString('id-ID')}</p>
        </div>
    )
}