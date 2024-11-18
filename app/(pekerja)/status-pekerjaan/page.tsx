import { Metadata } from "next";
import NavBar from "../../components/NavBar";
import { pekerjaKategoriJasaService } from "../../db/services/pekerjaKategoriJasa";
import { subkategoriJasaService } from "../../db/services/subkategoriJasa";
import { getUser } from "../../functions/auth/getUser";
import StatusPekerjaanContent from "./StatusPekerjaanContent";

type SearchParams = {
    searchParams: {
        query?: string;
        filter?: string;
    }
}

export const metadata: Metadata = {
    title: "Status Order | SIJARTA",
    description: "Sistem Informasi Jasa Rumah Tangga - by AKV",
    icons: {
        icon: "/favicon.ico",
    },
};

export default async function Page({ searchParams }: SearchParams) {
    const user = await getUser();
    const params = searchParams;
    
    const query = params?.query ?? "";
    const filter = params?.filter ?? "none";

    return (
        <main className="min-h-screen">
            <NavBar />
            <StatusPekerjaanContent
                user={user}
                initialQuery={query}
                initialFilter={filter}
            />
        </main>
    )
}