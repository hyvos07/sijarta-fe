// path : sijarta-fe/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./_styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIJARTA",
  description: "Sistem Informasi Jasa Rumah Tangga - by AKV",
  icons: {
    icon: "favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${poppins.className}`}>
        {children}
      </body>
    </html>
  );
}
