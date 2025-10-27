"use client"
//import Hero from "./components/Hero"
//import Categories from "./components/Categories"
//import FeaturedCycles from "./components/FeaturedCycles"
import Reviews from "./components/Reviews"
import AboutUs from "./components/AboutUs"
import { lazy } from 'react'
import { Suspense } from "react"
import { Metadata } from 'next'

const LazyHero = lazy(() => import("./components/Hero"))
const LazyCategories = lazy(() => import("./components/Categories"))
const LazyFeaturedCycles = lazy(() => import("./components/FeaturedCycles"))

// Skeleton imports
import HeroSkeleton from "./components/skeletons/HeroSkeleton"
import CategoriesSkeleton from "./components/skeletons/CategoriesSkeleton"
import FeaturedCyclesSkeleton from "./components/skeletons/FeaturedCyclesSkeleton"
import ReviewsSkeleton from "./components/skeletons/ReviewsSkeleton"
// import FloatingElements from "./components/animations/FloatingElements"
// import ParticleSystem from "./components/animations/ParticleSystem"
import HomepageOfferManager from "./components/HomepageOfferManager"

// Home page specific structured data
const homePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Premium Bicycles Collection",
  "description": "Explore our extensive collection of premium bicycles including mountain bikes, city bikes, kids bikes, and cycling accessories.",
  "url": "https://therajacyclestores.com",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Featured Bicycle Categories",
    "numberOfItems": 6,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Mountain Bikes",
        "description": "High-performance mountain bikes for off-road adventures"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "City Bikes",
        "description": "Comfortable city bikes for urban commuting"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Kids Bikes",
        "description": "Safe and fun bicycles designed for children"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Women Bikes",
        "description": "Stylish and comfortable bikes designed for women"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Electric Bikes",
        "description": "Modern e-bikes with advanced electric assistance"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "Hybrid Bikes",
        "description": "Versatile hybrid bikes for multiple terrains"
      }
    ]
  }
}

export default function Home() {
  return (
    <>
      {/* SEO structured data for home page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homePageJsonLd),
        }}
      />
      
      <div className="min-h-screen w-full overflow-x-hidden bg-white dark:bg-gray-900 transition-colors duration-300">

        <Suspense fallback={<HeroSkeleton />}>
          <LazyHero />
        </Suspense>

        <Suspense fallback={<CategoriesSkeleton />}>
          <div data-section="categories">
            <LazyCategories />
          </div>
        </Suspense>

        <Suspense fallback={<FeaturedCyclesSkeleton />}>
          <div data-section="featured">
            <LazyFeaturedCycles />
          </div>
        </Suspense>
        
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews />
        </Suspense>
        
          <AboutUs />

        {/* Homepage Offer Popup Manager */}
        <HomepageOfferManager />
      </div>
    </>
  )
}
