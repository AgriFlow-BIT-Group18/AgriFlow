import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TranslationProvider } from "@/hooks/useTranslation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#2D6C50",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "AgriFlow - Système de Distribution d'Intrants Agricoles",
    template: "%s | AgriFlow"
  },
  description: "Optimisez votre rendement agricole avec AgriFlow. Solution numérique pour la gestion et la distribution d'engrais et semences certifiées au Burkina Faso et en Afrique de l'Ouest.",
  keywords: [
    "AgriFlow",
    "Agriculture numérique Burkina Faso",
    "Achat engrais en ligne",
    "Semences certifiées Afrique de l'Ouest",
    "Distribution intrants agricoles",
    "Modernisation agriculture",
    "Gestion stocks agricoles",
    "Fertilisants certifiés",
    "Digital agriculture Africa",
    "Agtech Burkina",
    "Productivité agricole",
    "Suivi distribution engrais",
    "NPK 15-15-15 Burkina",
    "Urée 46 Burkina Faso",
    "Semences de maïs hybride",
    "Riz pluvial semences",
    "Sorgho et Mil intrants",
    "Producteurs agricoles Faso",
    "Coopératives agricoles Afrique",
    "Sécurité alimentaire Sahel",
    "Résilience agricole",
    "Subvention intrants Burkina",
    "Traçabilité engrais blockchain",
    "Financement agricole numérique",
    "Maraîchage Burkina Faso",
    "Intrants coton Burkina",
    "Boutique engrais Ouagadougou",
    "Vente semences Bobo-Dioulasso",
    "Logiciel gestion agricole",
    "Système distribution gouvernemental",
    "Souveraineté alimentaire Afrique",
    "Agri-business West Africa",
    "Fertilizer supply chain",
    "Seed variety certification",
    "AgriFlow APP",
    "Application agriculture mobile",
    "Conseil agricole numérique",
    "Prix engrais Burkina 2026",
    "Campagne agricole Burkina",
    "Développement rural Afrique",
    "Irrigation et intrants",
    "Agriculture durable Sahel",
    "Pluviométrie et engrais",
    "Outil aide à la décision agricole",
    "Cartographie sols Burkina",
    "Espace Producteur AgriFlow",
    "Gestionnaire d'intrants certifié",
    "Marché agricole digital",
    "Exportation produits tropicaux",
    "Transformation agricole Faso",
    "Jeunesse et Agriculture numérique",
    "Formation agricole en ligne",
    "Pesticides homologués Burkina",
    "Matériel agricole et intrants",
    "AGRA Afrique de l'Ouest",
    "CILSS sécurité alimentaire",
    "UEMOA agriculture",
    "CEDEAO politique agricole",
    "Innovation agricole Burkina"
  ],
  metadataBase: new URL('https://agri-flow-self.vercel.app'),
  authors: [{ name: "AgriFlow Team" }],
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/?lang=en',
      'fr-FR': '/?lang=fr',
      'pt-BR': '/?lang=pt',
      'es-ES': '/?lang=es',
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://agri-flow-self.vercel.app",
    siteName: "AgriFlow",
    title: "AgriFlow - Digitaliser la distribution agricole pour un meilleur rendement",
    description: "La plateforme de référence pour la gestion transparente et efficace des intrants agricoles au Burkina Faso.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "AgriFlow - Moderniser l'agriculture en Afrique"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "AgriFlow - Digitalizing Agricultural Distribution",
    description: "Increase farming efficiency with our digital solution for certified seed and fertilizer management.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "F2PJsA9LRgLdGifaEakE0iTd1I2x3YDrowGwZnD3VO8",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
