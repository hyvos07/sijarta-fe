import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kelola Pekerjaan | SIJARTA",
    description: "Sistem Informasi Jasa Rumah Tangga - by AKV",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function PekerjaanLayout({ children }: { children: React.ReactNode }) {
    return children;
}