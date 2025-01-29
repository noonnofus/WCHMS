import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/shared/top-nav";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "West Coast Healthy Memory Society",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full w-full overflow-hidden">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-[360px] w-full h-full flex flex-col`}
            >
                <TopNav />
                <div className="flex-1 px-6 overflow-y-auto">{children}</div>
            </body>
        </html>
    );
}
