// path : sijarta-fe/app/_components/mypay/transaksi/forms/WithdrawForm.tsx

"use client"
import { useState } from "react";

export default function WithdrawForm() {
    const [bank, setbank] = useState("none");

    function onBankChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setbank(event.target.value);
    }
    
    return (
        <div className="flex flex-col my-8">
            <p className="text-lg font-semibold my-3">Bank</p>
            <select id="bank" className="py-3 h-min bg-zinc-800 pl-4 border-r-[16px] border-zinc-800 outline outline-2 outline-zinc-700 rounded-xl" onChange={onBankChange} value={bank}>
                <option value="none" disabled>Pilih bank</option>
                <option value="mandiri">Bank Mandiri</option>
                <option value="bni">Bank Negara Indonesia</option>
                <option value="bri">Bank Rakyat Indonesia</option>
                <option value="bca">Bank Central Asia</option>
            </select>
            <p className="text-lg font-semibold my-3 mt-6">Nomor Rekening</p>
            <input type="number" id="norek" name="norek"
                className="py-3 px-3 border border-gray-600 rounded-lg bg-transparent text-base focus:outline focus:outline-blue-500 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className="text-lg font-semibold my-3 mt-6">Nominal</p>
            <input type="number" id="nominal" name="nominal"
                className="py-3 px-3 border border-gray-600 rounded-lg bg-transparent text-base focus:outline focus:outline-blue-500 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="flex md:justify-end mt-10 md:mt-8" >
                <button
                    type="submit"
                    className="md:w-36 w-full py-3 bg-zinc-100 text-black font-semibold rounded-2xl shadow-lg hover:bg-white"
                    onClick={(e) => { e.preventDefault(); alert('done'); }}
                >
                    Withdraw
                </button>
            </div>
        </div>
    );
}
