import { Metadata } from "next";
import NavBar from "@/app/_components/NavBar";
import { pekerjaKategoriJasaService } from "@/src/db/services/pekerjaKategoriJasa";
import { subkategoriJasaService } from "@/src/db/services/subkategoriJasa";
import { getUser } from "@/src/functions/auth/getUser";
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
    const pekerjaKategoriJasa = await pekerjaKategoriJasaService.getMapKategoriJasaByID(user.id);

    const subkategoriMap = new Map();
    for (const [id, _] of pekerjaKategoriJasa) {
        const subkategori = await subkategoriJasaService.getAllSubkategori(id);
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