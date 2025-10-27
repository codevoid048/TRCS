import { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: "About Us - 45+ Years of Cycling Excellence | The Raja Cycle Stores",
  description: "Discover the story behind India's premier bicycle destination. Learn about our 45+ years of cycling expertise, premium quality service, and commitment to every rider's journey.",
  keywords: "about raja cycle stores, bicycle shop history, cycling experts India, premium bike service, bicycle store Vijayawada, cycling community",
  openGraph: {
    title: "About The Raja Cycle Stores - Your Cycling Partners Since 45+ Years",
    description: "Discover the story behind India's premier bicycle destination. Learn about our cycling expertise and commitment to quality.",
    type: "website",
    url: "https://therajacyclestores.com/about",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "About The Raja Cycle Stores - Cycling Excellence",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About The Raja Cycle Stores - Your Cycling Partners",
    description: "Discover the story behind India's premier bicycle destination. Learn about our cycling expertise and commitment to quality.",
    images: ["/logo.webp"]
  },
  alternates: {
    canonical: "https://therajacyclestores.com/about"
  }
}

export default function AboutPage() {
  return <AboutPageClient />
}
