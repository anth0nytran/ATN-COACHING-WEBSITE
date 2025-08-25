import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Valorant Coaching - Professional FPS Training & Rank Improvement",
  description: "Get coached by a pro Valorant player. Improve your aim, game sense, and rank with personalized 1-on-1 coaching, VOD reviews, and duo queue sessions. ESEA Open Season 37 Champion with 7000+ CS:GO hours.",
  keywords: [
    "Valorant coaching",
    "Valorant aim training", 
    "Valorant VOD review",
    "rank up in Valorant",
    "FPS coaching",
    "Valorant rank improvement",
    "professional Valorant training"
  ],
  authors: [{ name: "Antho Coaching" }],
  creator: "Antho Coaching",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anthocoaching.com",
    title: "Valorant Coaching - Professional FPS Training & Rank Improvement",
    description: "Get coached by a pro Valorant player. Improve your aim, game sense, and rank with personalized coaching sessions.",
    siteName: "Antho Valorant Coaching",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valorant Coaching - Professional FPS Training & Rank Improvement",
    description: "Get coached by a pro Valorant player. Improve your aim, game sense, and rank with personalized coaching sessions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable} dark`}>
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
