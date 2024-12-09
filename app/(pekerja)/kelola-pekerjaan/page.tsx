import { Metadata } from "next";
import NavBar from "@/app/_components/NavBar";
import { PekerjaKategoriJasaModel } from "@/src/db/models/pekerjaKategoriJasa";
import { SubkategoriJasaModel } from "@/src/db/models/subkategoriJasa";
import { getUser } from "@/src/functions/getUser";
import PekerjaanContent from "./PekerjaanContent";

export const metadata: Metadata = {
    title: "Order | SIJARTA",
    description: "Sistem Informasi Jasa Rumah Tangga - by AKV",
    icons: {
        icon: "/favicon.ico",
    },
};

export default async function Page() {
    const user = await getUser();
    const pekerjaKategoriJasa = await new PekerjaKategoriJasaModel().getMapKategoriJasaByID(user.id);

    const subkategoriMap = new Map();
    for (const [id, _] of pekerjaKategoriJasa) {
        const subkategori = await new SubkategoriJasaModel().getAllByKategori(id);
        subkategoriMap.set(id, subkategori);
    }

    return (
        <main className="min-h-screen">
            <NavBar />
            <PekerjaanContent 
                user={user}
                kategori={pekerjaKategoriJasa}
                subkategori={subkategoriMap}
            />
        </main>
    )
}