"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Star,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Settings,
  Users,
  Share2
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Hero Banner",
    href: "/admin/hero-banner",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Users,
  },
  {
    name: "Featured",
    href: "/admin/featured",
    icon: Star,
  },
  {
    name: "Social Posts",
    href: "/admin/social-posts",
    icon: Share2,
  },
  {
    name: "Requests",
    href: "/admin/requests",
    icon: MessageSquare,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    name: "Product Config",
    href: "/admin/product-config",
    icon: Settings,
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // console.log("Logging out");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${API_BASE_URL}/admin/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        logout();
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

             {/* Sidebar - Always visible on desktop */}
       <div className="hidden lg:flex lg:flex-shrink-0">
         <div className="flex flex-col w-64 sticky top-0 h-screen">
           <div className="flex flex-col h-full bg-white shadow-xl border-r border-gray-200">
            {/* Header */}
            <div className="flex items-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src="/logo.webp"
                    alt="Admin Logo"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Admin Panel
                  </h2>
                  <p className="text-sm text-gray-500">Cycle Store</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    whileHover={{ x: 4 }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      active
                        ? "bg-primary-main text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-primary-main"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    {active && <ChevronRight className="h-4 w-4 ml-auto" />}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : "-100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src="/logo.webp"
                  alt="Admin Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Admin Panel
                </h2>
                <p className="text-sm text-gray-500">Cycle Store</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <motion.button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    active
                      ? "bg-primary-main text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:text-primary-main"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                  {active && <ChevronRight className="h-4 w-4 ml-auto" />}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
                 {/* Top bar */}
         <div className="bg-white sticky top-0 z-10 shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-4">
               <button
                 onClick={() => setSidebarOpen(true)}
                 className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
               >
                 <Menu className="h-5 w-5 text-gray-600" />
               </button>
             </div>
             <div className="flex items-center space-x-4 ml-auto">
               <motion.button
                 onClick={handleLogout}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
               >
                 <LogOut className="h-4 w-4" />
                 <span className="hidden sm:block text-sm font-medium">
                   Logout
                 </span>
               </motion.button>
             </div>
           </div>
         </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
      
      {/* Toast notifications */}
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
    </div>
  );
}
