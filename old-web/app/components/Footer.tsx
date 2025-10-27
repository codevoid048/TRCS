"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, ChevronRight, Sparkles } from "lucide-react"
import { FaWhatsapp, FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      } as const
    }
  }

  const socialLinks = [
    { icon: FaFacebook, href: "https://facebook.com/RajaCycles/", color: "hover:text-blue-500" },
    { icon: FaInstagram, href: "https://instagram.com/Rajacycles", color: "hover:text-pink-500" },
    { icon: FaYoutube, href: "https://www.youtube.com/@therajacyclestores", color: "hover:text-red-500" },
    { icon: FaWhatsapp, href: "https://wa.me/message/USB4AL3NSJVGM1", color: "hover:text-green-500" }
  ]

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Cycles", href: "/cycles" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" }
  ]

  const categories = [
    { label: "Kids Cycles", href: "/cycles?category=Kids" },
    { label: "Adult Cycles", href: "/cycles?category=Adults" },
    { label: "Women Cycles", href: "/cycles?category=Women" },
    { label: "Electric Cycles", href: "/cycles?category=Electric" }
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      <motion.div
        className="relative max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8 lg:gap-6">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-3 group">
              <motion.div
                className="relative"
              >
                <div className="relative w-[64px] h-[64px] md:w-[72px] md:h-[72px]">
                  <Image
                    src="/logo.webp"
                    alt="Raja Cycle Stores Logo"
                    fill
                    className="object-cover relative rounded-2xl"
                  />
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">
                  The Raja
                </h2>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">
                  Cycle Stores
                </h2>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Ride with Trust. Ride with Raja.
            </p>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Sparkles className="h-4 w-4 text-primary-main" />
              <span>Since 1982</span>
            </div>

            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10 text-gray-300 transition-all duration-300 ${social.color} hover:bg-white/20 hover:border-white/30`}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links - Mobile: side by side with Categories, Desktop: separate column */}
          <motion.div variants={itemVariants} className="lg:block">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-0">
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4 md:mb-6 flex items-center space-x-2">
                  <span className="bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">Quick Links</span>
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {quickLinks.map((link, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        href={link.href}
                        className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                      >
                        <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative text-sm md:text-base">
                          {link.label}
                          <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-blue-400 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Categories - Mobile: side by side with Quick Links, Desktop: hidden (shown in separate column) */}
              <div className="lg:hidden">
                <h3 className="text-lg font-semibold mb-4 md:mb-6">
                  <span className="bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">Categories</span>
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {categories.map((category, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        href={category.href}
                        className="group flex items-center justify-between text-gray-400 hover:text-white transition-all duration-300"
                      >
                        <span className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="relative text-sm md:text-base">
                            {category.label}
                            <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-purple-400 to-pink-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                          </span>
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Categories - Desktop only */}
          <motion.div variants={itemVariants} className="hidden lg:block">
            <h3 className="text-lg font-semibold mb-6">
              <span className="bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">Categories</span>
            </h3>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={category.href}
                    className="group flex items-center justify-between text-gray-400 hover:text-white transition-all duration-300"
                  >
                    <span className="flex items-center">
                      <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative">
                        {category.label}
                        <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-purple-400 to-pink-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                      </span>
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6">
              <span className="bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">Get in Touch</span>
            </h3>
            <div className="space-y-4">
              <motion.div
                className="flex items-start space-x-3 group"
                whileHover={{ x: 5 }}
              >
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-white/10 group-hover:border-white/30 transition-colors">
                  <MapPin className="h-5 w-5 text-primary-main" />
                </div>
                <div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    29-21-34, Beside Vins Hospital<br />
                    Eluru Rd, Near Vijaya Talkies<br />
                    Vijayawada, AP 520002
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-3 group"
                whileHover={{ x: 5 }}
              >
                <div className="p-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-white/10 group-hover:border-white/30 transition-colors">
                  <Phone className="h-5 w-5 text-primary-main" />
                </div>
                <a href="tel:+918688432642" className="text-gray-300 hover:text-white transition-colors">
                  +91 8688432642
                </a>
              </motion.div>

              <motion.div
                className="flex items-center space-x-3 group"
                whileHover={{ x: 5 }}
              >
                <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-white/10 group-hover:border-white/30 transition-colors">
                  <Mail className="h-5 w-5 text-primary-main" />
                </div>
                <a href="mailto:therajacyclestores@gmail.com" className="text-gray-300 hover:text-white transition-colors text-sm">
                  therajacyclestores@gmail.com
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="border-t border-white/10 mt-8 pt-4"
        >
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} The Raja Cycle Stores. All rights reserved.
              {/* <Link
                href="/team"              >
                <span className="relative text-gray-600 text-sm">Dev Team</span>
              </Link> */}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}