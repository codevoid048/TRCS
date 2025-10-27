"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Globe } from "lucide-react"
import Link from "next/link"

// Custom Twitter/X icon component
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

// Custom Behance icon component
const BehanceIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.5 4.7h3.9c1.6 0 2.9 1.3 2.9 2.9s-1.3 2.9-2.9 2.9H6.5V4.7zm0 7.8h4.5c1.9 0 3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5H6.5v-7zm9.5-5.5h4v1h-4v-1zm2 3c1.9 0 3.5 1.6 3.5 3.5 0 .3 0 .6-.1.9h-6.4c.2 1.1 1.2 1.9 2.3 1.9.8 0 1.5-.4 1.9-1h2.3c-.6 1.8-2.3 3-4.2 3-2.5 0-4.5-2-4.5-4.5s2-4.8 4.5-4.8z"/>
  </svg>
)

const teamMembers = [
    {
        name: "William",
        role: "Full Stack Developer",
        accounts: {
            github: "https://github.com/codevoid048",
            linkedin: "https://linkedin.com/in/codevoid",
            email: "williamkeri007@gmail.com",
            twitter: "https://x.com/code__void",
            portfolio: "https://codevoid.site"
        }
    },
    {
        name: "Sahiti",
        role: "Frontend Developer",
        accounts: {
            github: "https://github.com/sahiti0424",
            linkedin: "https://linkedin.com/in/sahitiakella",
            email: "akellasahiti12@gmail.com"
        }
    },
    {
        name: "Lokesh",
        role: "Frontend Developer",
        accounts: {
            github: "https://github.com/Lokeshmarthi",
            linkedin: "https://www.linkedin.com/in/naga-lokesh-marthi-8b4784249",
            email: "lokeshparzival@gmail.com"
        }
    },
    {
        name: "Sanjani",
        role: "UI/UX Designer",
        accounts: {
            linkedin: "https://www.linkedin.com/in/sanjani-jakkamsetti",
            email: "sanjani.jakkamsetti@gmail.com",
            behance: "https://www.behance.net/sanjani-jakkamsetti"
        }
    },
    // Add more team members here as needed
    // {
    //   name: "Jane Smith",
    //   role: "UI/UX Designer",
    //   description: "Creative designer focused on user experience and modern design principles",
    //   accounts: {
    //     github: "https://github.com/janesmith",
    //     linkedin: "https://linkedin.com/in/janesmith",
    //     email: "jane@example.com",
    //     twitter: "https://twitter.com/janesmith"
    //   }
    // }
]

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-hero text-[#2D3436] dark:text-white mb-4 transition-colors duration-300">
                            Development Team
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
                            Meet the developers behind The Raja Cycle Stores platform
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Team Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="bg-white font-hero dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                        >
                            {/* Header with Icon */}
                            <div className="text-center mb-6">
                                {/* <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-white" />
                </div> */}
                                <h3 className="text-2xl font-bold text-[#2D3436] dark:text-white mb-2 transition-colors duration-300">
                                    {member.name}
                                </h3>
                                <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-3">
                                    {member.role}
                                </p>
                                {/* <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
                  {member.description}
                </p> */}
                            </div>

                            {/* Social Links */}
                            <div className="flex justify-center space-x-4">
                                {member.accounts.github && (
                                    <motion.a
                                        href={member.accounts.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                                    >
                                        <Github className="h-5 w-5" />
                                    </motion.a>
                                )}
                                {member.accounts.linkedin && (
                                    <motion.a
                                        href={member.accounts.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </motion.a>
                                )}
                                {member.accounts.email && (
                                    <motion.a
                                        href={`mailto:${member.accounts.email}`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-300"
                                    >
                                        <Mail className="h-5 w-5" />
                                    </motion.a>
                                )}
                                {member.accounts.twitter && (
                                    <motion.a
                                        href={member.accounts.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-blue-400 hover:text-white transition-colors duration-300"
                                    >
                                        <TwitterIcon className="h-5 w-5" />
                                    </motion.a>
                                )}
                                {member.accounts.behance && (
                                    <motion.a
                                        href={member.accounts.behance}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-colors duration-300"
                                    >
                                        <BehanceIcon className="h-5 w-5" />
                                    </motion.a>
                                )}
                                {member.accounts.portfolio && (
                                    <motion.a
                                        href={member.accounts.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-green-600 hover:text-white transition-colors duration-300"
                                    >
                                        <Globe className="h-5 w-5" />
                                    </motion.a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Project Info Section
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#2D3436] dark:text-white mb-4 transition-colors duration-300">
              Built with Passion
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
              This platform was built using modern web technologies including Next.js, React, TypeScript, 
              Tailwind CSS, and Framer Motion to provide the best user experience for The Raja Cycle Stores.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Next.js</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Framework</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">React</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Library</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">TypeScript</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Language</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Tailwind</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Styling</div>
            </div>
          </div>
        </motion.div> */}

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        ← Back to Home
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
