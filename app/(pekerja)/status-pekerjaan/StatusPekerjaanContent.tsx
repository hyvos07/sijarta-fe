// path : sijarta-fe/app/(pekerja)/status-pekerjaan/route.ts

'use client';
import CircularLoading from '@/app/_components/CircularLoading';
import StatusCard from '@/app/_components/pekerjaan/StatusCard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ContentProps {
    user: any;
    initialQuery: string;
    initialFilter: string;
}

async function getAllPesanan(id: string, query: string, filter: string) {
    const response = await fetch(`/api/status-pesanan?idPekerja=${id}&query=${query}&filter=${filter}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    return data.pesanan;
}

export default function StatusPekerjaanContent({ user, initialQuery, initialFilter }: ContentProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [pesanan, setPesanan] = useState<JSX.Element[]>([]);
    const [inputValue, setInputValue] = useState(initialQuery);
    const [query, setQuery] = useState(initialQuery);
    const [filter, setFilter] = useState(initialFilter);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getAllPesanan(user.id, query, filter);
            const enrichedPesanan = await Promise.all(
                data.map(async (pes: any) => {
                    if (pes.status === 'Pesanan dibatalkan' || pes.status === 'Menunggu Pembayaran') {
                        return null;
                    }

                    return (
                        <StatusCard key={pes.id} pesanan={pes} />
                    );
                })
            );
            setPesanan(enrichedPesanan);
            setLoading(false);
        };

        fetchData();
    }, [query, filter]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilter = e.target.value;
        setFilter(newFilter);
    };

    const handleSearch = () => {
        setQuery(inputValue);
        updateURL(inputValue, filter);
        router.refresh();
    };

    const updateURL = (newQuery: string, newFilter: string) => {
        const params = new URLSearchParams();
        if (newQuery) params.set('query', newQuery);
        if (newFilter) params.set('filter', newFilter);
        router.push(`/status-pekerjaan?${params.toString()}`);
    };

    return (
        <div className="mx-4 md:mx-12 my-6 mb-8 p-4">
            <p className="text-3xl font-semibold text-center">Status Pekerjaan</p>
            <div className="flex md:flex-row flex-col gap-4 my-12 justify-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Cari nama jasa"
                    className="md:w-96 px-4 py-2 border border-zinc-700 rounded bg-zinc-900"
                />
                <select
                    value={filter}
                    onChange={handleFilter}
                    className="md:w-52 py-2 px-3 border-r-8 border-zinc-900 outline outline-1 outline-zinc-700 rounded bg-zinc-900"
                >
                    <option value="none">Semua Status</option>
                    <option value="Menunggu Pekerja Berangkat">Menunggu Pekerja Berangkat</option>
                    <option value="Pekerja tiba di lokasi">Pekerja tiba di lokasi</option>
                    <option value="Pelayanan jasa sedang dilakukan">Pelayanan jasa sedang dilakukan</option>
                    <option value="Pesanan selesai">Pesanan selesai</option>
                    <option value="Pesanan dibatalkan">Pesanan dibatalkan</option>
                </select>
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-zinc-200 text-black rounded hover:bg-white font-medium"
                >
                    Cari
                </button>
            </div>
            <div className="flex flex-col w-full items-center">
                {loading ? (<CircularLoading />)
                    : pesanan.length === 0 ? (
                        <p className="font-medium my-16 text-zinc-500">Tidak ada pesanan yang cocok. Nganggur ye?</p>
                    ) : (
                        pesanan
                    )
                }
            </div>
        </div>
    );
}