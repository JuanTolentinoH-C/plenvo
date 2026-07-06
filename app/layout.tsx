import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plenvo · Business Studio — Convierte ideas en negocios",
  description:
    "Plenvo es tu Business Studio: crea un plan de negocio profesional en minutos, listo para postular a Startup Perú, Innóvate Perú o solicitar un microcrédito.",
  applicationName: "Plenvo",
  authors: [{ name: "Plenvo" }],
  keywords: [
    "Plenvo",
    "plan de negocio",
    "Startup Perú",
    "Innóvate Perú",
    "emprendedores",
    "Perú",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-plenvo-gray">
        {children}
      </body>
    </html>
  );
}
