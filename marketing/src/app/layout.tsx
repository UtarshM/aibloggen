import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Scalezix - AI-Powered Content Creation & Marketing Automation",
    template: "%s | Scalezix",
  },
  description:
    "Create SEO-optimized content, publish to WordPress, and grow your business with powerful AI tools. Join 10,000+ marketers using Scalezix.",
  keywords: [
    "AI content creation",
    "SEO optimization",
    "WordPress automation",
    "content marketing",
    "AI writing",
    "blog automation",
    "marketing automation",
    "AI marketing",
  ],
  authors: [{ name: "HARSH J KUHIKAR" }],
  creator: "Scalezix",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scalezix.com",
    siteName: "Scalezix",
    title: "Scalezix - AI-Powered Content Creation & Marketing Automation",
    description:
      "Create SEO-optimized content, publish to WordPress, and grow your business with powerful AI tools.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scalezix - AI Marketing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scalezix - AI-Powered Content Creation",
    description:
      "Create SEO-optimized content and grow your business with AI tools.",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Scalezix",
              url: "https://scalezix.com",
              logo: "https://scalezix.com/scalezix_logo.png",
              description:
                "AI-powered content creation and marketing automation platform",
              sameAs: [
                "https://twitter.com/scalezix",
                "https://linkedin.com/company/scalezix",
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
