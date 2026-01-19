import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";
import Script from "next/script";

export const metadata = {
  title: "E-Store",
  description: "Premium products and goods",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="layout-body">
        {/* Razorpay Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />

        <Providers>
          <Header />

          <main className="layout-main">{children}</main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
