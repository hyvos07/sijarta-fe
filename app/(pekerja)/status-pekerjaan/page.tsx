// path : sijarta-fe/app/(pekerja)/status-pekerjaan/page.tsx

import { Metadata } from "next";
import NavBar from "@/app/_components/NavBar";
import { getUser } from "@/src/functions/getUser";
import StatusPekerjaanContent from "./StatusPekerjaanContent";

type SearchParams = {
    query?: string;
    filter?: string;
}

export const metadata: Metadata = {
    title: "Status Order | SIJARTA",
    description: "Sistem Informasi Jasa Rumah Tangga - by AKV",
    icons: {
        icon: "/favicon.ico",
    },
};

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const user = await getUser();
    const params = searchParams;

    const query = (await params)?.query ?? "";
    const filter = (await params)?.filter ?? "none";

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