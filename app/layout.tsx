import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
        <body className={inter.className}>
        {/* Server-rendered debug banner (remove when done) */}
        <div id="server-render-test" style={{position: 'fixed', top: 8, right: 8, background: '#0b0b0b', color: '#fff', padding: '6px 8px', borderRadius: 6, zIndex: 9999}}>SSR OK</div>
        {children}
        </body>
        </html>
    );
}