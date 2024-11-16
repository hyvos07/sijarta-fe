import { TrMyPay } from "@/app/db/types/trMypay"
import { kategoriTrMyPayService } from "@/app/db/services/kategoriTrMypay"

export default function TRCard({ tgl, nominal, kategori }: TrMyPay & { kategori: string }) {
    const date = new Date(tgl).toLocaleDateString('id-ID')
    const incoming = (kategori === "TopUp MyPay" || kategori === "Terima Honor")
    
    return (
        <div className="p-4 bg-black rounded-lg shadow-md border border-gray-700 flex justify-between">
            <div className="flex flex-col">
                <p className="text-gray-400">{new Date(tgl).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <p className="font-semibold">{kategori}</p>
            </div>
            <p className={"flex font-bold justify-center items-center" + ` ${incoming ? 'text-green-500' : 'text-red-500'}`}>{incoming ? '+' : '-'}Rp {nominal.toLocaleString('id-ID')}</p>
        </div>
    )
}