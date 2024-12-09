// path : sijarta-fe/app/mypay/transaksi/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transaksi | SIJARTA",
    description: "Sistem Informasi Jasa Rumah Tangga - by AKV",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function TransaksiLayout({ children }: { children: React.ReactNode }) {
    return children;
}