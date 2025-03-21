// path : sijarta-fe/app/mypay/transaksi/page.tsx

import NavBar from "@/app/_components/NavBar";
import { getUser } from "@/src/functions/getUser";
import TransaksiForm from "./TransaksiContent";
import { getTypeCookie } from "@/src/functions/cookies";

export default async function Page() {
    const user = await getUser();
    const isPekerja = (await getTypeCookie())?.value === 'pekerja';

    return (
        <main>
            <NavBar />
            <div className="flex-col items-center">
                <h2 className="mx-4 md:mx-12 text-2xl md:text-4xl font-semibold md:mt-12 mt-9 md:mb-0 mb-9 text-center">Transaksi</h2>
                <div className="flex-row mt-2 justify-center mt-4 mb-10 gap-3 md:flex hidden">
                    <p className="text-sm font-semibold text-zinc-400">Tanggal Transaksi:</p>
                    <p className="text-sm font-medium text-zinc-400">{new Date('2024-11-19').toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <TransaksiForm user={user} isPekerja={isPekerja} />
            </div>
        </main>
    )
}