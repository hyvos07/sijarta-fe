'use client';
import { useState, useEffect } from 'react';
import { User } from '@/app/db/types/user';
import CircularLoading from "../../components/CircularLoading";
import { SubkategoriJasa } from '../../db/types/subkategoriJasa';
import { KategoriJasa } from '../../db/types/kategoriJasa';
import PesananCard from '../../components/pekerjaan/PesananCard';

interface PekerjaanContentProps {
    user: User;
    kategori: Map<string, KategoriJasa>;
    subkategori: Map<string, SubkategoriJasa[]>;
}

async function getAllPesanan(id: string) {
    const response = await fetch(`/api/pesanan?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    return data.pesanan;
}

export default function PekerjaanContent({ user, kategori, subkategori }: PekerjaanContentProps) {
    const [kategoriState, setkategoriState] = useState("none");
    const [subkategoriState, setSubkategoriState] = useState("none");
    const [pesanan, setPesanan] = useState<JSX.Element[]>([]);
    const [loading, setLoading] = useState(false);

    var ready = kategoriState !== "none" && subkategoriState !== "none";

    useEffect(() => {
        ready = kategoriState !== "none" && subkategoriState !== "none";

        if (ready) {
            setLoading(true);
            const fetchPesanan = async () => {
                try {
                    const allPesanan = await getAllPesanan(subkategoriState);
                    const enrichedPesanan = await Promise.all(
                        allPesanan.map(async (pes: any) => {
                            return (
                                <PesananCard pesanan={pes} key={pes.id} />
                            );
                        })
                    );
                    setPesanan(enrichedPesanan);
                } catch (error) {
                    console.error('Error fetching pesanan:', error);
                } finally {
                    setLoading(false);
                }
            };
            
            fetchPesanan();
        }

    }, [kategoriState, subkategoriState]);

    function onChangeKategori(event: React.ChangeEvent<HTMLSelectElement>) {
        setkategoriState(event.target.value);
    }

    function onChangeSubkategori(event: React.ChangeEvent<HTMLSelectElement>) {
        setSubkategoriState(event.target.value);
    }

    return (
        <div className="mx-4 md:mx-12 my-6 mb-8 p-4">
            <h1 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
                Order
            </h1>
            <div className='flex md:px-16 justify-center gap-8 md:flex-row flex-col'>
                <select id="kategori" className="py-3 w-full h-min bg-zinc-800 pl-2 border-r-[6px] border-zinc-800 outline outline-2 outline-zinc-700 rounded-xl overflow-ellipsis" onChange={onChangeKategori} value={kategoriState}>
                    <option value="none" disabled className="text-sm md:text-base">Kategori</option>
                    {[...kategori.values()].map((value) => {
                        return <option key={value.id} value={value.id} className="text-sm md:text-base">{value.namaKategori}</option>
                    })}
                </select>
                <select id="subkategori" className="py-3 w-full h-min bg-zinc-800 pl-2 border-r-[6px] border-zinc-800 outline outline-2 outline-zinc-700 rounded-xl overflow-ellipsis" onChange={onChangeSubkategori} value={subkategoriState}>
                    <option value="none" disabled className="text-sm md:text-base">Subkategori</option>
                    {
                        kategoriState === "none" ? null 
                            : subkategori.get(kategoriState)?.map((value) => {
                                return <option key={value.id} value={value.id} className="text-sm md:text-base">{value.namaSubKategori}</option>
                            })
                    }
                </select>
            </div>
            <div className="flex justify-center my-16">
                {
                    ready ?
                        loading ? 
                            <CircularLoading /> 
                            : pesanan.length > 0 ?
                                <div className="flex flex-col w-full md:px-20">
                                    {pesanan}
                                </div>
                                : <p className="text-zinc-500 font-semibold my-12">Tidak ada pesanan.</p>
                        : <p className="text-zinc-500 font-semibold text-center my-12">Pilih kategori dan subkategori terlebih dahulu.</p>
                }
            </div>
        </div>
    );
}