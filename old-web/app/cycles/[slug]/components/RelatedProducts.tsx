"use client"

import { motion } from "framer-motion"
import CycleCard from "../../components/CycleCard"
import { Product } from "@/types/product"
import { useEffect, useState } from "react"
import { ProductsAPI } from "@/lib/api/products"

interface RelatedProductsProps {
    currentProductID: Product["_id"]
    brand: string
    category: string
}

export default function RelatedProducts({ currentProductID, brand, category }: RelatedProductsProps) {

    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(async () => {
            try {
                const response = await ProductsAPI.getRelatedProducts(brand, category);
                if (!cancelled) {
                    setRelatedProducts(response.data);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Error fetching related products:", error);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [currentProductID, brand])

    if (relatedProducts.length <= 1) return null

    return (
        <>
            <h2 className="text-2xl font-bold text-[#2D3436] dark:text-white mb-6 transition-colors duration-300">
                You Might Also Like
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-2 md:gap-4">
                {relatedProducts.map((product, index) => (
                    product._id != currentProductID && (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <CycleCard product={product} />
                        </motion.div>
                    )
                ))}
            </div>
        </>
    )
}
