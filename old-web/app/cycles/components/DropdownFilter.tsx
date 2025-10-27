"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface DropdownFilterProps {
    label: string
    options: any[]
    selectedValues: string[]
    onChange: (value: string) => void
    type?: 'string' | 'color'
    isOpen?: boolean
    onToggle?: () => void
}

const DropdownFilter = React.memo(({
    label,
    options,
    selectedValues,
    onChange,
    type = 'string',
    isOpen = false,
    onToggle
}: DropdownFilterProps) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Use external state if provided, otherwise use internal state
    const isDropdownOpen = onToggle ? isOpen : internalIsOpen
    const toggleDropdown = onToggle || (() => setInternalIsOpen(!internalIsOpen))

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if (onToggle) {
                    // If external control, just close this one
                    if (isOpen) onToggle()
                } else {
                    setInternalIsOpen(false)
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onToggle])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
                <span>{label}</span>
                <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="h-4 w-4" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl dark:shadow-2xl z-50 max-h-48 overflow-y-auto"
                    >
                        {options.map((option) => {
                            const value = typeof option === 'string' ? option : option.name
                            const isSelected = selectedValues.includes(value)

                            return (
                                <motion.label
                                    key={value}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100 transition-colors duration-150"
                                    whileHover={{ backgroundColor: "var(--hover-bg)" }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => onChange(value)}
                                        className="rounded border-gray-300 dark:border-gray-500 text-primary-main focus:ring-primary-main dark:bg-gray-700 dark:checked:bg-primary-main"
                                    />
                                    {type === 'color' && option.hex && (
                                        <div
                                            className="w-4 h-4 rounded border border-gray-300 dark:border-gray-500"
                                            style={{ backgroundColor: option.hex }}
                                        />
                                    )}
                                    <span className="text-sm">{value}</span>
                                </motion.label>
                            )
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
})

DropdownFilter.displayName = 'DropdownFilter'

export default DropdownFilter
