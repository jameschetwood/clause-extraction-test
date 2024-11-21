import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Menu from "./components/Menu";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Clause Extraction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-200">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-h-screen flex flex-col gap-4 mx-auto max-w-[1200px] pt-4`}
      >
        <div className="flex">
          <Menu />
        </div>
        {children}
      </body>
    </html>
  );
}
