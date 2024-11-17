"use client"
import { User } from "@/app/db/types/user";
import { useState } from "react";

type TransaksiContentProps = {
    user: User;
    isPekerja: boolean;
}

export default function TransaksiContent({ user, isPekerja }: TransaksiContentProps) {
    const [type, setType] = useState("none");
    const [transactionId, setTransactionId] = useState(0);

    function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setType(event.target.value);
    }

    function onJasaChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setTransactionId(parseInt(event.target.value));
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
                <select id="transaksi" className="md:mt-0 mt-10 py-3 w-64 h-min bg-zinc-800 pl-2 border-r-[6px] border-zinc-800 outline outline-2 outline-zinc-700 rounded-xl" onChange={onChange} value={type}>
                    <option value="none" disabled>Pilih tipe</option>
                    <option value="topup">Topup MyPay</option>
                    {!isPekerja && <option value="pay">Bayar Jasa</option>}
                    <option value="transfer">Transfer MyPay</option>
                    <option value="withdrawal">Tarik ke Bank</option>
                </select>
            </div>
            <form name="transaksi" className="md:mt-4 md:w-[770px] w-full">
                {type === "none" &&
                    <p className="text-lg font-semibold text-zinc-500 text-center my-32">Silakan pilih tipe transaksi yang diinginkan.</p>
                }
                {type === "topup" &&
                    <div className="flex flex-col my-8">
                        <p className="text-lg font-semibold my-3">Nominal</p>
                        <input type="number" id="nominal" name="nominal" 
                            className="py-3 px-3 border border-gray-600 rounded-lg bg-transparent text-base focus:outline focus:outline-blue-500 
                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className="flex md:justify-end mt-8">
                            <button 
                                type="submit" 
                                className="md:w-36 w-full py-3 bg-zinc-100 text-black font-semibold rounded-2xl shadow-lg hover:bg-white"
                                onClick={(e) => {e.preventDefault(); alert('done');}}
                            >
                                Topup
                            </button>
                        </div>
                    </div>
                }
                {type === "pay" && !isPekerja &&
                    <div>
                        <label htmlFor="transactionSelect" className="block text-xl font-bold mt-2">Pesanan Jasa:</label>
                        <select id="transactionSelect" name="transaction" className="w-full mt-2 p-2 border rounded" onChange={onJasaChange}>
                            <option value="none" disabled>Pilih pesanan</option>
                            <option value="1">Cleaning Service #1</option>
                            <option value="2">Repair Service #1</option>
                            <option value="3">Delivery Service #1</option>
                        </select>
                        <label htmlFor="amount" className="block text-xl font-bold mt-2">Nominal:</label>
                        {transactionId === 1 &&
                            <p className="text-lg font-bold">Rp 100.000</p>
                        }
                        {transactionId === 2 &&
                            <p className="text-lg font-bold">Rp 200.000</p>
                        }
                        {transactionId === 3 &&
                            <p className="text-lg font-bold">Rp 50.000</p>
                        }
                        <div className="flex justify-center">
                            <button type="submit" className="mt-4 px-10 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow-lg hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-110">Bayar</button>
                        </div>
                    </div>
                }
                {type === "transfer" &&
                    <div>
                        <label htmlFor="number" className="block text-xl font-bold mt-2">Nomor HP:</label>
                        <input type="number" id="amount" name="phoneNumber" className="w-full p-2 border rounded" />
                        <label htmlFor="amount" className="block text-xl font-bold mt-2">Nominal:</label>
                        <input type="number" id="amount" name="amount" className="w-full p-2 border rounded" />
                        <div className="flex justify-center">
                            <button type="submit" className="mt-4 px-10 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow-lg hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-110">Transfer</button>
                        </div>
                    </div>
                }
                {type === "withdrawal" &&
                    <div>
                        <label htmlFor="bankSelect" className="block text-xl font-bold mt-2">Nama bank:</label>
                        <select id="bankSelect" name="bank" className="w-full mt-2 p-2 border rounded">
                            <option value="none" disabled>Pilih bank</option>
                            <option value="mandiri">Bank Mandiri</option>
                            <option value="bni">Bank Negara Indonesia</option>
                            <option value="bri">Bank Rakyat Indonesia</option>
                            <option value="bca">Bank Central Asia</option>
                        </select>
                        <label htmlFor="norek" className="block text-xl font-bold mt-2">Nomor Rekening:</label>
                        <input type="number" id="norek" name="norek" className="w-full p-2 border rounded" />
                        <label htmlFor="amount" className="block text-xl font-bold mt-2">Nominal:</label>
                        <input type="number" id="amount" name="amount" className="w-full p-2 border rounded" />
                        <div className="flex justify-center">
                            <button type="submit" className="mt-4 px-10 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow-lg hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-110">Withdraw</button>
                        </div>
                    </div>
                }
            </form>
        </div>
    )
}
