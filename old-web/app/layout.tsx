import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, Roboto, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./components/ThemeProvider"
import ErrorBoundary from "./components/ErrorBoundary"
import ConditionalLayout from "./components/ConditionalLayout"
import SEOAnalytics from "./components/SEOAnalytics"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://therajacyclestores.com'),
  title: {
    default: "The Raja Cycle Stores - Premium Bicycles & Cycling Gear | Best Bike Shop",
    template: "%s | The Raja Cycle Stores"
  },
  description: "India's premier bicycle destination. Shop premium cycles, mountain bikes, city bikes, kids bikes & cycling accessories. Expert service, competitive prices, 45+ years experience. Free delivery available.",
  keywords: [
    "bicycle shop India",
    "premium cycles",
    "mountain bikes",
    "city bikes", 
    "kids bicycles",
    "women bikes",
    "cycling gear",
    "bike accessories",
    "bicycle store",
    "cycling equipment",
    "bicycle repair service",
    "bike maintenance",
    "cycling store near me",
    "best bicycle shop",
    "cycle dealers"
  ].join(", "),
  authors: [{ name: "The Raja Cycle Stores" }],
  creator: "The Raja Cycle Stores",
  publisher: "The Raja Cycle Stores",
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
  icons: {
    icon: [
      { url: "/logo.webp", sizes: "32x32", type: "image/png" },
      { url: "/logo.webp", sizes: "16x16", type: "image/png" }
    ],
    apple: [
      { url: "/logo.webp", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/logo.webp"
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://therajacyclestores.com",
    siteName: "The Raja Cycle Stores",
    title: "The Raja Cycle Stores - Premium Bicycles & Cycling Gear",
    description: "India's premier bicycle destination. Shop premium cycles, mountain bikes, city bikes, kids bikes & cycling accessories. Expert service, competitive prices, 45+ years experience.",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "The Raja Cycle Stores - Premium Bicycle Shop",
        type: "image/png"
      },
      {
        url: "/herosec.webp",
        width: 1200,
        height: 630,
        alt: "Premium Bicycles Collection at The Raja Cycle Stores",
        type: "image/jpeg"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rajacyclestores",
    creator: "@rajacyclestores",
    title: "The Raja Cycle Stores - Premium Bicycles & Cycling Gear",
    description: "India's premier bicycle destination. Shop premium cycles, mountain bikes, city bikes, kids bikes & cycling accessories.",
    images: ["/logo.webp"]
  },
  alternates: {
    canonical: "https://therajacyclestores.com",
    languages: {
      'en-IN': 'https://therajacyclestores.com',
      'hi-IN': 'https://therajacyclestores.com/hi'
    }
  },
  category: "E-commerce",
  classification: "Bicycle Retail Store",
  other: {
    'google-site-verification': 'your-google-verification-code',
    'msvalidate.01': 'your-bing-verification-code'
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8b4513" },
    { media: "(prefers-color-scheme: dark)", color: "#654321" }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://therajacyclestores.com/#organization",
        "name": "The Raja Cycle Stores",
        "url": "https://therajacyclestores.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://therajacyclestores.com/logo.webp",
          "width": 400,
          "height": 400
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-8688432642",
          "contactType": "customer service",
          "availableLanguage": ["English", "Hindi"]
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "29-21-34, Beside Vins Hospital, Eluru Rd, Near Vijaya Talkies",
          "addressLocality": "Vijayawada",
          "addressRegion": "Andhra Pradesh",
          "postalCode": "520002",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://www.facebook.com/rajacyclestores",
          "https://www.instagram.com/rajacyclestores",
          "https://twitter.com/rajacyclestores"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://therajacyclestores.com/#website",
        "url": "https://therajacyclestores.com",
        "name": "The Raja Cycle Stores",
        "description": "India's premier bicycle destination. Shop premium cycles, mountain bikes, city bikes, kids bikes & cycling accessories.",
        "publisher": {
          "@id": "https://therajacyclestores.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://therajacyclestores.com/cycles?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Store",
        "@id": "https://therajacyclestores.com/#store",
        "name": "The Raja Cycle Stores",
        "image": "https://therajacyclestores.com/logo.webp",
        "description": "Premium bicycle store offering mountain bikes, city bikes, kids bikes, and cycling accessories with expert service.",
        "priceRange": "₹₹",
        "telephone": "+91-8688432642",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "29-21-34, Beside Vins Hospital, Eluru Rd, Near Vijaya Talkies",
          "addressLocality": "Vijayawada",
          "addressRegion": "Andhra Pradesh",
          "postalCode": "520002",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "16.514572576219987",
          "longitude": "80.63419610184974"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "19:00"
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${roboto.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Raja Cycles" />
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && 
          process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION !== 'your-google-verification-code' && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
        )}
        {process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && 
          process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION !== 'your-bing-verification-code' && (
          <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION} />
        )}
      </head>
      <body className={inter.className}>
        <SEOAnalytics />
        <Analytics />
        <ErrorBoundary>
          <ThemeProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
