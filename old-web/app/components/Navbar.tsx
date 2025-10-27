"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bike, Menu, X, ChevronDown } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [activeItem, setActiveItem] = useState("Home")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Check current path to set active item
  useEffect(() => {
    const path = window.location.pathname
    const hash = window.location.hash
    
    if (path === "/" && !hash) setActiveItem("Home")
    // else if (hash === "#categories") setActiveItem("Categories")
    else if (path === "/about") setActiveItem("About")
    else if (path === "/services") setActiveItem("Services")
    else if (path === "/blog") setActiveItem("Blog")
    else if (path === "/contact") setActiveItem("Contact")
  }, [])

  const navItems = [
    { label: "Home", href: "/#" },
    // { label: "Categories", href: "/#categories" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ]

  // Desktop navigation includes Services
  const desktopNavItems = [
    { label: "Home", href: "/#" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border-b border-gray-200/50 dark:border-gray-700/50" 
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Enhanced with better hover effects */}
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => (window.location.href = "/#")}
          >
            <motion.div 
              className="relative h-14 w-14 rounded-full overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-xl transition-shadow duration-300"
            >
              <div className="absolute inset-0 bg-primary-main/10 group-hover:bg-primary-main/20 transition-colors duration-300" />
              <Image
                src="/logo.webp"
                alt="CycleStore Logo"
                width={56}
                height={56}
                className="h-full w-full object-cover relative z-10"
              />
            </motion.div>
            <div className="flex flex-col">
              <span
              className="text-xl font-hero font-extrabold bg-gradient-to-r bg-clip-text text-transparent from-primary-light via-secondary-main to-primary-main cursor-pointer hover:from-secondary-main hover:to-primary-main transition-all duration-300"
              onClick={() => (window.location.href = "/#")}
            >
              The Raja Cycle Stores
            </span>
            </div>
          </motion.div>

          {/* Desktop Navigation - Enhanced */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-2 mr-4">
              {desktopNavItems.map((item, index) => (
                <div key={item.label} className="relative">
                  <motion.a
                    href={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => setActiveItem(item.label)}
                    className={`
                      relative px-2 py-2.5 text-sm font-medium font-hero tracking-wide
                      transition-all duration-300 rounded-lg text-black dark:text-white ${hoveredItem === item.label ? "bg-gray-100 dark:bg-gray-800" : ""}
                    `}
                  >
                    {/* Hover Background */}
                    <AnimatePresence>
                      {hoveredItem === item.label && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg -z-10"
                        />
                      )}
                    </AnimatePresence>

                    {/* Active Indicator */}
                    {/* {activeItem === item.label && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-main/10 dark:bg-primary-light/10 rounded-lg -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )} */}

                    {/* Text */}
                    <span className="relative text-sm font-extrabold z-10">
                      {item.label}
                    </span>
                  </motion.a>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mr-4 px-6 py-2.5 bg-primary-main hover:bg-primary-dark text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
              onClick={() => (router.push("/cycles"))}
            >
              Explore Cycles
            </motion.button>

            {/* Theme Toggle with better styling */}
            {/* <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <ThemeToggle />
            </motion.div> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* <ThemeToggle /> */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu - Keep as is since you're fine with it */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl mt-3 p-2 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 mx-2"
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center justify-center py-4 px-3 rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl hover:bg-gradient-to-br hover:from-primary-main/10 hover:to-secondary-main/10 dark:hover:from-primary-light/10 dark:hover:to-secondary-main/10 hover:text-primary-main dark:hover:text-primary-light transition-all duration-300 font-medium border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-main/20 dark:hover:border-primary-light/20 text-center"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setActiveItem(item.label)
                      }}
                    >
                      <span className="text-sm font-semibold">
                        {item.label}
                      </span>
                    </motion.a>
                  ))}
                </div>
                
                {/* Mobile Services and Cycles Row */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Services Button */}
                  <motion.a
                    href="/services"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-4 px-3 rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl hover:bg-gradient-to-br hover:from-primary-main/10 hover:to-secondary-main/10 dark:hover:from-primary-light/10 dark:hover:to-secondary-main/10 hover:text-primary-main dark:hover:text-primary-light transition-all duration-300 font-medium border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-main/20 dark:hover:border-primary-light/20 text-center"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setActiveItem("Services")
                    }}
                  >
                    <span className="text-sm font-semibold">Services</span>
                  </motion.a>

                  {/* Cycles CTA Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-4 px-3 bg-primary-main hover:bg-primary-dark text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
                    onClick={() => {
                      router.push("/cycles")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Cycles
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}