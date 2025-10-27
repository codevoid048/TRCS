"use client"

import { motion } from "framer-motion"
import { FaWhatsapp, FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa"
import { MapPin, Phone, Mail, ChevronDown, Clock, Star, MessageCircle } from "lucide-react"
import { useState } from "react"

// Contact page structured data
const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact The Raja Cycle Stores",
  "description": "Get in touch with India's premier bicycle store. Visit our showroom, call us, or send a message for expert cycling advice and premium bike services.",
  "url": "https://therajacyclestores.com/contact",
  "mainEntity": {
    "@type": "LocalBusiness",
    "name": "The Raja Cycle Stores",
    "telephone": "+91-8688432642",
    "email": "therajacyclestores@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "29-21-34, Beside Vins Hospital, Eluru Rd, Near Vijaya Talkies",
      "addressLocality": "Vijayawada",
      "addressRegion": "Andhra Pradesh", 
      "postalCode": "520002",
      "addressCountry": "IN"
    },
    "openingHours": [
      "Mo-Sa 10:00-21:00",
      "Su 10:00-14:30"
    ],
    "priceRange": "₹₹",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"]
  }
}

export default function ContactPageClient() {
  
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "What are your store hours?",
      answer: "We are open Monday to Saturday from 9:00 AM to 8:00 PM, and Sunday from 10:00 AM to 6:00 PM.",
    },
    {
      question: "Do you provide cycle repair services?",
      answer:
        "Yes, we offer comprehensive repair and maintenance services for all types of cycles. Our experienced technicians can handle everything from basic tune-ups to major repairs.",
    },
    {
      question: "Can I test ride a cycle before purchasing?",
      answer:
        "We encourage customers to test ride our cycles. Please bring a valid ID and we'll be happy to let you try out any cycle you're interested in.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept cash, all major credit cards, debit cards, UPI payments, and also offer EMI options for purchases above ₹10,000.",
    },
    {
      question: "Do you offer home delivery?",
      answer:
        "Yes, we provide free home delivery within Vijayawada city limits. For areas outside the city, delivery charges may apply based on distance.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* SEO structured data for contact page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageJsonLd),
        }}
      />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-indigo-400/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >            
            <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent mb-6 leading-tight">
              Contact Us
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Ready to find your perfect ride? We're here to help you discover the cycle of your dreams at{" "}
              <span className="font-semibold bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">The Raja Cycle Stores</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            {/* Contact Details */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Let's Connect
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Visit us, call us, or drop us a message. We'd love to hear from you!
                </p>
              </div>

              <div className="space-y-8">
                {/* Address */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="group p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Visit Our Store</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        The Raja Cycle Stores, Center
                        <br />
                        29-21-34, Beside Vins Hospital
                        <br />
                        Eluru Rd, Near Vijaya Talkies
                        <br />
                        <span className="font-semibold text-blue-600 dark:text-blue-400">Vijayawada, Andhra Pradesh 520002</span>
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="group p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Call Us</h3>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">+91 8688432642</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available 7 days a week</p>
                    </div>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="group p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Us</h3>
                      <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">therajacyclestores@gmail.com</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We'll respond within 24 hours</p>
                    </div>
                  </div>
                </motion.div>

                {/* Store Hours */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="group p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Store Hours</h3>
                      <div className="space-y-1">
                        <p className="text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">Mon-Sat:</span> 10:00 AM - 9:00 PM
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">Sunday:</span> 10:00 AM - 2:30 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Social Media Links */}
              <div className="pt-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Follow Our Journey</h3>
                <div className="flex space-x-4">
                  {[
                    { icon: FaFacebook, href: "https://facebook.com/RajaCycles/", bg: "bg-blue-600", hover: "hover:bg-blue-700", label: "Facebook" },
                    { icon: FaWhatsapp, href: "https://wa.me/message/USB4AL3NSJVGM1", bg: "bg-green-600", hover: "hover:bg-green-700", label: "WhatsApp" },
                    { icon: FaInstagram, href: "https://instagram.com/Rajacycles", bg: "bg-gradient-to-br from-pink-500 to-purple-600", hover: "hover:from-pink-600 hover:to-purple-700", label: "Instagram" },
                    { icon: FaYoutube, href: "https://www.youtube.com/@therajacyclestores", bg: "bg-red-600", hover: "hover:bg-red-700", label: "YouTube" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 ${social.bg} ${social.hover} text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
                      aria-label={social.label}
                    >
                      <social.icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="sticky top-8">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
                  <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Find Us</h3>
                    <p className="text-gray-600 dark:text-gray-300">Visit our store in Vijayawada</p>
                  </div>
                  <div className="h-96 lg:h-[500px] relative">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.2300510450937!2d80.63412149999999!3d16.514479599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35e54988ce8c69%3A0x7ca0db2c52aded9c!2sThe%20Raja%20Cycle%20Stores!5e0!3m2!1sen!2sin!4v1754152844543!5m2!1sen!2sin" 
                      width="100%" 
                      height="100%"
                      style={{border:0}} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="The Raja Cycle Stores Location"
                      className="rounded-b-2xl"
                    ></iframe>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4 mr-2" />
              Common Questions
            </motion.div> */}
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about our cycles, services, and policies
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
                >
                  <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0">
                    <ChevronDown
                      className={`h-6 w-6 text-gray-500 dark:text-gray-400 transition-all duration-300 ${
                        openFaq === index ? "transform rotate-180 text-blue-600 dark:text-blue-400" : ""
                      }`}
                    />
                  </div>
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="px-8 pb-6"
                  >
                    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
