"use client"

import GoogleAnalytics from './GoogleAnalytics'
import GoogleTagManager from './GoogleTagManager'

// Replace these with your actual IDs
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'

export default function SEOAnalytics() {
  return (
    <>
      {process.env.NODE_ENV === 'production' && (
        <>
          <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
          <GoogleTagManager GTM_ID={GTM_ID} />
        </>
      )}
    </>
  )
}
