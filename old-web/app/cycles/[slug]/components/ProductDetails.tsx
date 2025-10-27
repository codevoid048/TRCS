"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  // MessageCircle,
  // Truck,
  // Shield,
  Package,
  AlertTriangle,
  Ruler,
  ShoppingCart,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import ProductSpecs from "./ProductSpecs";
import RelatedProducts from "./RelatedProducts";
import ColorVariants from "./ColorVariants";
// import SizeGuide from "./SizeGuide";
import FloatingRequestButton from "./FloatingRequestButton";
import type { Product } from "@/types/product";
import RequestModal from "./RequestModal";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  // const [isWishlisted, setIsWishlisted] = useState(false);
  // const [selectedColor, setSelectedColor] = useState(
  //   Array.isArray(product.color) ? product.color[0]?.name || "white" : ""
  // );
  // const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const isOutOfStock = product.stock === 0;
  // const isLowStock = cycle.stock > 0 && cycle.stock <= 3;

  // Get recommended rider height based on frame size
  const getRecommendedRiderHeight = (frameSize: string): string => {
    const sizeMap: Record<string, string> = {
      'S': "5'2\" - 5'6\"",
      'M': "5'6\" - 5'10\"", 
      'L': "5'10\" - 6'2\"",
      'XL': "6'2\" - 6'6\""
    }
    return sizeMap[frameSize] || "5'6\" - 6'0\""
  }

  const handleBack = () => {
    router.back();
  };

  // const handleWishlist = () => {
  //   setIsWishlisted(!isWishlisted);
  // };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const handleTalkToUs = () => {
    const phoneNumber = "+918688432642";
    const productUrl = window.location.href;
    const message = `Hi! I'm interested in ${product.name}. Can you help me with more details?\n\nProduct: ${productUrl}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm font-body text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300"
        >
          <button
            onClick={handleBack}
            className="flex items-center space-x-1 hover:text-primary-main transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <span>/</span>
          <button
            onClick={() => router.push("/cycles")}
            className="hover:text-primary-main transition-colors"
          >
            <span>Cycles</span>
          </button>
          <span>/</span>
          <button
            onClick={() => router.push("/cycles?brand=" + product.brand)}
            className="hover:text-primary-main transition-colors"
          >
            <span>{product.brand}</span>
          </button>
          <span>/</span>
          <span className="text-[#2D3436] dark:text-white font-medium transition-colors duration-300">
            {product.name}
          </span>
        </motion.div>

        {/* Out of Stock Banner */}
        {isOutOfStock && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center space-x-3"
          >
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium font-subheading">
                This item is currently out of stock
              </p>
              <p className="text-red-600 dark:text-red-400 text-sm font-body">
                We'll notify you when it becomes available again
              </p>
            </div>
          </motion.div>
        )}

        {/* Main Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left Side - Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={isOutOfStock ? "opacity-60" : ""}
          >
            <div className="relative">
              {isOutOfStock && (
                <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[0.5px] z-10 rounded-xl flex items-center justify-center">
                  <div className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg font-accent">
                    Out of Stock
                  </div>
                </div>
              )}
              <ImageGallery product={product} />
            </div>
          </motion.div>

          {/* Right Side - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header Actions */}
            <div className="flex items-start">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-cycleHeading font-bold text-[#2D3436] dark:text-white mb-2 transition-colors duration-300">
                  {product.name}
                </h1>
              </div>
              <div className="flex space-x-2 ml-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-3 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-primary-main hover:text-primary-main transition-all duration-200 hover-lift"
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Stock Status */}
            {/* <div className="flex items-center space-x-4">
              {isOutOfStock ? (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <Package className="h-5 w-5" />
                  <span className="font-medium font-subheading">
                    Out of Stock
                  </span>
                </div>
              ) : (
                <div
                  className={`flex items-center space-x-2 ${
                    isLowStock
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  <Package className="h-5 w-5" />
                  <span className="font-medium font-subheading">
                    {isLowStock
                      ? `Only ${cycle.stock} left in stock!`
                      : `${cycle.stock} in stock`}
                  </span>
                </div>
              )}
            </div> */}

            {/* Price */}
            {/* <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-heading font-bold text-primary-main">
                  ₹{cycle.price.toLocaleString()}
                </span>
                {cycle.originalPrice && (
                  <span className="text-xl font-body text-gray-500 dark:text-gray-400 line-through transition-colors duration-300">
                    ₹{cycle.originalPrice.toLocaleString()}
                  </span>
                )}
                {cycle.originalPrice && (
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm font-medium font-accent transition-colors duration-300">
                    {Math.round(((cycle.originalPrice - cycle.price) / cycle.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
              <p className="text-sm font-body text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Inclusive of all taxes
              </p>
            </div> */}

            {/* Description */}
            <div>
              <h3 className="text-lg font-subheading font-semibold text-[#2D3436] dark:text-white mb-3 transition-colors duration-300">
                Description
              </h3>
              <i className="text-gray-700 dark:text-gray-300 leading-relaxed font-body transition-colors duration-300">
                {product.description}
              </i>
            </div>

            {/* Color Variants */}
            <ColorVariants
              product={product}
              // selectedColor={selectedColor}
              // onColorChange={setSelectedColor}
            />

            {/* Size Guide */}
            {/* <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-subheading font-semibold text-[#2D3436] dark:text-white transition-colors duration-300">
                  Frame Size
                </h3>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center space-x-1 text-accent-main hover:text-accent-dark transition-colors font-accent text-sm"
                >
                  <Ruler className="h-4 w-4" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg transition-colors duration-300">
                <p className="font-medium font-body text-[#2D3436] dark:text-white transition-colors duration-300">
                  {product.frameSize}
                </p>
                <p className="text-sm font-body text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Recommended for riders{" "}
                  {getRecommendedRiderHeight(product.frameSize)}
                </p>
              </div>
            </div> */}

            {/* Product Info Component */}
            <ProductInfo product={product} />

            {/* Action Buttons */}
            <div className="space-y-4">
              {isOutOfStock ? (
                <>
                  <button
                    disabled
                    className="w-full bg-gray-400 dark:bg-gray-600 text-white py-4 rounded-lg font-semibold text-lg cursor-not-allowed opacity-60 flex items-center justify-center space-x-2 font-accent"
                  >
                    <Package className="h-5 w-5" />
                    <span>Out of Stock</span>
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-secondary-main hover:bg-secondary-dark text-[#2D3436] py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl font-accent hover-lift"
                  >
                    Notify When Available
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowRequestModal(true)}
                      className="bg-gradient-to-r from-primary-main to-secondary-main hover:bg-primary-dark text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 font-accent hover-lift pulse-on-hover"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Enquire Now</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleTalkToUs}
                      className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 font-accent hover-lift"
                    >
                      <FaWhatsapp className="h-5 w-5" />
                      <span className="hidden sm:inline">Chat on Whatsapp</span>
                      <span className="sm:hidden">WhatsApp</span>
                    </motion.button>
                  </div>
                </>
              )}
            </div>

            {/* Features */}
            {/* <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center hover-lift">
                <Truck className="h-6 w-6 text-primary-main mx-auto mb-2" />
                <p className="text-sm font-medium font-subheading text-[#2D3436] dark:text-white transition-colors duration-300">
                  Free Delivery
                </p>
                <p className="text-xs font-body text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Within 7 days
                </p>
              </div>
              <div className="text-center hover-lift">
                <Shield className="h-6 w-6 text-primary-main mx-auto mb-2" />
                <p className="text-sm font-medium font-subheading text-[#2D3436] dark:text-white transition-colors duration-300">
                  2 Year Warranty
                </p>
                <p className="text-xs font-body text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Manufacturing defects
                </p>
              </div>
            </div> */}
          </motion.div>
        </div>

        {/* Product Specifications */}
        <ProductSpecs product={product} />
        </div>
              
        {/* Related Products */}
        <RelatedProducts currentProductID={product._id} brand={product.brand} category={product.category}/>

        {/* Size Guide Modal */}
        {/* <SizeGuide
          product={product}
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
        /> */}
      </div>

      {/* Floating Request Button */}
      {!isOutOfStock && <FloatingRequestButton product={product} />}

      {/* Request Modal */}
      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        product={product}
      />
    </>
  );
}
