import type { Metadata } from 'next'
import { Poppins } from "next/font/google";
import '../styles/globals.css'

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: 'Login | Sijarta',
    description: 'Simple Next.js Authentication Example',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`antialiased ${poppins.className}`}>
                <main className="flex items-center justify-center min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    )
}