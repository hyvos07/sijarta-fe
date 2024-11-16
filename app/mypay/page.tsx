import type { Metadata } from "next";
import { cookies } from "next/headers";
import "../styles/globals.css";
import NavBar from "../components/NavBar";
import { userService } from "../db/services/user";
import { decrypt } from "../functions/cipher";
import { trMyPayService } from "../db/services/trMypay";
import TRCard from "../components/mypay/trCard";
import { kategoriTrMyPayService } from "../db/services/kategoriTrMypay";

export const metadata: Metadata = {
    title: "MyPay | SIJARTA",
    description: "Sistem Informasi Jasa Rumah Tangga - by AKV",
    icons: {
        icon: "favicon.ico",
    },
};


const authToken = ((await cookies()).get("auth-token")?.value);
const user = await userService.getUserByID(decrypt(authToken!).slice(-36));
const transaksi = await trMyPayService.getAllTransaksi(user!.id);
const saldoMyPay = user?.saldoMyPay || 0;

const cards = transaksi.map(async (tr) => {
    const kategori = await kategoriTrMyPayService.getKategoriById(tr.kategoriID);
    return (
        <TRCard tgl={tr.tgl} nominal={tr.nominal} kategori={kategori} key={tr.id} id={tr.id} userID={tr.userID} kategoriID={tr.kategoriID} />
    )
});

export default async function Page() {
    return (
        <main>
            <NavBar />
            <div className="mx-4 md:mx-12 my-6 md:p-4 p-2">
                <div className="flex px-8 py-8 rounded-[24px] border border-zinc-700 bg-zinc-900 mb-8 md:mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-center w-full">
                        <div className="flex md:flex-col md:justify-start md:w-auto md:mb-0 mb-6 justify-between w-full">
                            <h1 className="text-lg md:text-2xl font-semibold mb-2">Saldo MyPay {user!.nama.split(' ')[0]}</h1>
                            <p className="text-lg text-zinc-500">Rp {saldoMyPay.toLocaleString('id-ID')}</p>
                        </div>
                        <div>
                            <button className="bg-zinc-200 px-6 py-3 text-lg text-black font-semibold py-2 px-4 rounded">
                                Lakukan Transaksi
                            </button>
                        </div>
                    </div>
                </div>
                <div className="pt-2">
                    <h2 className="pl-1.5 text-xl md:text-2xl md:text-left text-center font-semibold mb-8">Riwayat Transaksi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {await Promise.all(cards)}
                    </div>
                </div>
            </div>
        </main>
    )
}
