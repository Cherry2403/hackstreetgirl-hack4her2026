import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CompareProvider } from "@/components/compare/CompareContext";
import CompareTray from "@/components/compare/CompareTray";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { AnimalProvider } from "@/components/animals/AnimalContext";
import { getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return lang === "en"
    ? {
        title: "bol – shop smart, choose sustainable",
        description:
          "bol.com hackathon clone — shopping with insight into sustainability, CO₂ footprint and eco-labels.",
      }
    : {
        title: "bol – winkel slim, kies duurzaam",
        description:
          "bol.com hackathon clone — winkelen met inzicht in duurzaamheid, CO₂-voetafdruk en eco-labels.",
      };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();

  return (
    <html lang={lang} className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-bol-gray">
        <LanguageProvider lang={lang}>
          <AnimalProvider>
            <CompareProvider>
              <Suspense fallback={<div className="h-[124px] bg-bol-blue" />}>
                <Header />
              </Suspense>
              <main className="flex-1">{children}</main>
              <Footer />
              <CompareTray />
            </CompareProvider>
          </AnimalProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
