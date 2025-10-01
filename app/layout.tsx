import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from '@/src/components/Footer';

import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Riya's Portfolio",
    description: "Modern & Minimal portfolio",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <link rel="icon" href="/jsm-logo.png" sizes="any" />
            {/* Load compiled Tailwind CSS (generated at public/tailwind.css) */}
            <link rel="stylesheet" href="/tailwind.css" />
        </head>
        <body className={`${inter.className} bg-black`}>
        {children}
        <Footer />
        </body>
        </html>
    );
}