import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import DevelopmentNotice from "@/components/DevelopmentNotice";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

const spaceMono = Space_Mono({
  variable: "--font-tech",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "E-WasteWise",
  description: "Informational website about e-waste management and recycling",
  openGraph: {
    title: "E-WasteWise",
    description: "Informational website about e-waste management and recycling",
    url: "https://e-wastewise.vercel.app", // Replace with your actual URL
    siteName: "E-WasteWise",
    images: [
      {
        url: "https://e-wastewise.vercel.app/ewastewise.png", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "E-WasteWise Open Graph Image",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${bebasNeue.variable} ${spaceMono.variable} antialiased`}
      >
        <DevelopmentNotice />
        {children}
      </body>
    </html>
  );
}
