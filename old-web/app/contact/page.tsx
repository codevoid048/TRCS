import { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: "Contact Us - Expert Bicycle Services & Support | The Raja Cycle Stores",
  description: "Contact India's premier bicycle store for expert advice, premium bike services, and cycling support. Visit our showroom, call us, or send a message today.",
  keywords: "contact bicycle shop, bike store location, cycling support India, bicycle repair contact, bike service center, cycling experts contact",
  openGraph: {
    title: "Contact The Raja Cycle Stores - Expert Bicycle Services",
    description: "Get in touch with India's premier bicycle store for expert cycling advice and premium bike services.",
    type: "website",
    url: "https://therajacyclestores.com/contact",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "Contact The Raja Cycle Stores - Expert Bicycle Services",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact The Raja Cycle Stores - Expert Bicycle Services",
    description: "Get in touch with India's premier bicycle store for expert cycling advice and premium bike services.",
    images: ["/logo.webp"]
  },
  alternates: {
    canonical: "https://therajacyclestores.com/contact"
  }
}

export default function ContactPage() {
  return <ContactPageClient />
}
