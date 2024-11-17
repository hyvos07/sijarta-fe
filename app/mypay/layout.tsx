import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "MyPay | SIJARTA",
    description: "Sistem Informasi Jasa Rumah Tangga - by AKV",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function MyPayLayout({ children }: { children: React.ReactNode }) {
    return children;
}