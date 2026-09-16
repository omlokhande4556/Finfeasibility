import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinFeasibility | SIH26091",
  description:
    "AI-Driven Hyper-Local Business Advisory and Financial structuring Assistant for Rural Micro-Entrepreneurs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-[#E3D9C8]">
      <body
        className={`${inter.className} min-h-screen bg-[#E3D9C8] text-ink antialiased flex flex-col`}
      >
        <Navbar />
        <main className="flex-1 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}