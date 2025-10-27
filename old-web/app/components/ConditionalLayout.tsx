"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const isTeamRoute = pathname?.startsWith('/team')

  return (
    <>
      {!isAdminRoute && !isTeamRoute && <Navbar />}
      <main>
        {children}
      </main>
      {!isAdminRoute && !isTeamRoute && <Footer />}
    </>
  )
} 