import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
// [TOAST]: টোস্ট নোটিফিকেশন দেখানোর জন্য Toaster কম্পোনেন্ট ইমপোর্ট করা হলো
import { Toaster } from "@/components/ui/toast";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookNook - Online Library",
  description:
    "Share the books on your shelf and borrow the ones you have been meaning to read.",
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
          {/* [TOAST]: অ্যাপের যেকোনো জায়গা থেকে toast.add() দিয়ে টোস্ট দেখানো যাবে */}
          <Toaster>
            <Navbar />
            {children}
            <Footer />
          </Toaster>
        </AuthProvider>
      </body>
    </html>
  );
}
