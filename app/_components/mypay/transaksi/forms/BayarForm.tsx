"use client"
import { useState } from "react";

export default function BayarForm() {
    const [idPesanan, setidPesanan] = useState(0);

    function onPesananChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setidPesanan(parseInt(event.target.value));
    }

    return (
        <div className="flex flex-col md:my-2 my-6">
            <p className="text-lg font-semibold my-3">Pesanan</p>
            <select id="pesanan" className="py-3 h-min bg-zinc-800 pl-4 border-r-[16px] border-zinc-800 outline outline-2 outline-zinc-700 rounded-xl" onChange={onPesananChange} value={idPesanan}>
                <option value="0" className="text-sm md:text-base" disabled>Pilih Pesanan</option>
                <option value="1" className="text-sm md:text-base">Servis Televisi dan Audio - 19 November 2024</option>
                <option value="2" className="text-sm md:text-base">Jasa Packing Profesional - 20 Agustus 2022</option>
                <option value="3" className="text-sm md:text-base">Pembersihan Harian - 5 April 1970</option>
            </select>
            <div className="flex w-full justify-between my-3 mt-6">
                <p className="text-lg font-semibold">Total Biaya</p>
                {idPesanan === 0 &&
                    <p className="text-lg font-semibold">Rp 0</p>
                }
                {idPesanan === 1 &&
                    <p className="text-lg font-semibold">Rp 200.000</p>
                }
                {idPesanan === 2 &&
                    <p className="text-lg font-semibold">Rp 100.000</p>
                }
                {idPesanan === 3 &&
                    <p className="text-lg font-semibold">Rp 50.000</p>
                }
            </div>
            <div className="flex md:justify-end mt-10 md:mt-8" >
                <button
                    type="submit"
                    className="md:w-36 w-full py-3 bg-zinc-100 text-black font-semibold rounded-2xl shadow-lg hover:bg-white"
                    onClick={(e) => { e.preventDefault(); alert('done'); }}
                >
                    Bayar
                </button>
            </div>
        </div>
    );
}