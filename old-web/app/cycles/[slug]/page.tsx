import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductsAPI } from '@/lib/api/products'
import ProductDetail from './components/ProductDetails'

export const dynamic = 'force-static'
export const revalidate = 60 // Revalidate every 60 seconds


export async function generateStaticParams() {
  return []
}

interface Props {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const response = await ProductsAPI.getProductBySlug(slug)
    const product = response.data.product

    if (!product) {
      return {
        title: 'Product Not Found - The Raja Cycle Stores',
        description: 'The requested product could not be found.'
      }
    }

    const productImage = product.images?.[0] || '/placeholder.jpg'
    const productUrl = `https://therajacyclestores.com/cycles/${slug}`

    return {
      title: `${product.name} - ${product.brand} | The Raja Cycle Stores`,
      description: `${product.brand} ${product.name} - Premium quality cycle available at The Raja Cycle Stores. ${product.category} with excellent features and competitive pricing.`,
      keywords: [
        product.name,
        product.brand,
        product.category,
        'bicycle',
        'cycle',
        'bike',
        'The Raja Cycle Stores'
      ].join(', '),
      
      // OpenGraph for social media sharing
      openGraph: {
        title: `${product.name} - ${product.brand}`,
        description: `${product.brand} ${product.name} - Premium quality cycle`,
        url: productUrl,
        siteName: 'The Raja Cycle Stores',
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: `${product.name} - ${product.brand}`,
          }
        ],
        type: 'website',
      },
      
      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - ${product.brand}`,
        description: `${product.brand} ${product.name} - Premium quality cycle`,
        images: [productImage],
      },
      
      // Additional metadata
      robots: 'index, follow',
      alternates: {
        canonical: productUrl,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product - The Raja Cycle Stores',
      description: 'Premium bicycles and cycling gear at The Raja Cycle Stores.'
    }
  }
}

// Main page component
export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  try {
    const response = await ProductsAPI.getProductBySlug(slug)
    const product = response.data.product

    if (!product) {
      notFound()
    }

    return <ProductDetail product={product} />
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }
}
