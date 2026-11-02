import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookNook - Neighbourhood Library",
  description: "Share the books on your shelf and borrow the ones you have been meaning to read.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${josefinSans.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* [AUTH PROVIDER]: পুরো অ্যাপ্লিকেশনে লগইন তথ্য উপলব্ধ করার জন্য AuthProvider মোড়ানো হলো */}
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
