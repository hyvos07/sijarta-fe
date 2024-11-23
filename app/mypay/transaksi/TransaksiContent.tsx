"use client"
import TransaksiForm from "@/app/_components/mypay/transaksi/TransaksiForm";
import { User } from "@/src/db/types/user";
import { useState } from "react";

type TransaksiContentProps = {
    user: User;
    isPekerja: boolean;
}

export default function TransaksiContent({ user, isPekerja }: TransaksiContentProps) {
    const [type, setType] = useState("none");

    function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setType(event.target.value);
    }

    return (
        <div className="px-8 flex flex-col items-center">
            <div className="flex md:flex-row flex-col md:w-[770px] w-full justify-between items-center">
                <div className="md:flex-col flex w-full justify-between">
                    <p className="text-lg md:text-xl font-semibold mb-1">{user.nama}</p>
                    <p className="text-lg font-semibold text-green-500">Rp {user.saldoMyPay.toLocaleString('id-ID')}</p>
                </div>
                <div className="md:hidden md:flex-col flex w-full justify-between mt-2">
                    <p className="text-sm font-semibold mb-2 text-zinc-400">Tanggal Transaksi:</p>
                    <p className="text-sm font-medium text-zinc-400">{new Date('2024-11-19').toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <select id="transaksi" className="md:mt-0 mt-10 py-3 md:w-64 w-full h-min bg-zinc-800 pl-2 border-r-[6px] border-zinc-800 outline outline-2 outline-zinc-700 rounded-xl" onChange={onChange} value={type}>
                    <option value="none" disabled className="text-sm md:text-base">Pilih tipe</option>
                    <option value="topup" className="text-sm md:text-base">Topup MyPay</option>
                    {!isPekerja && <option value="bayar" className="text-sm md:text-base">Bayar Jasa</option>}
                    <option value="transfer" className="text-sm md:text-base">Transfer MyPay</option>
                    <option value="withdraw" className="text-sm md:text-base">Tarik ke Bank</option>
                </select>
            </div>
            <TransaksiForm type={type} isPekerja={isPekerja} />
        </div>
    )
}
