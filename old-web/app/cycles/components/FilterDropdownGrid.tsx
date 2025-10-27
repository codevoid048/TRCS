"use client"

import React, { useState } from "react"
import DropdownFilter from "./DropdownFilter"

interface FilterDropdownGridProps {
    pendingFilters: any
    onFilterChange: (category: string, value: string) => void
    filterOptions?: {
        brands: string[]
        colors: Array<{
            name: string
            hex: string
            _id: string
        }>
        frameMaterials: string[]
        brakeTypes: string[]
        frameSizes: string[]
        wheelSizes: string[]
        categories: string[]
        gearTypes?: string[]
    } | null
}

const FilterDropdownGrid = React.memo(({
    pendingFilters,
    onFilterChange,
    filterOptions
}: FilterDropdownGridProps) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

    // Fallback filter data if API is not available
    const fallbackFilterConfig = {
        brands: ["Giant", "Trek", "Specialized", "Cannondale", "Scott"],
        colors: [
            { name: "Red", hex: "#FF0000", _id: "1" },
            { name: "Green", hex: "#00FF00", _id: "2" },
            { name: "Custom Blue", hex: "#28285E", _id: "3" },
            { name: "Yellow", hex: "#FFFF00", _id: "4" },
            { name: "Magenta", hex: "#FF00FF", _id: "5" },
            { name: "Cyan", hex: "#00FFFF", _id: "6" },
            { name: "Black", hex: "#000000", _id: "7" },
            { name: "White", hex: "#FFFFFF", _id: "8" }
        ],
        frameMaterials: ["Aluminum", "Carbon", "Steel", "Titanium"],
        brakeTypes: ["Disc", "Rim", "Drum", "Hydraulic Disc"],
        frameSizes: ["XS", "S", "M", "L", "XL", "XXL"],
        wheelSizes: ["20 inch", "24 inch", "26 inch", "27.5 inch", "29 inch", "700c"],
        categories: ["Men", "Women", "Hybrid", "Kids"],
        gearTypes: ["Single Speed", "7-Speed", "21-Speed", "24-Speed"]
    }

    // Use API data if available, otherwise use fallback
    const config = filterOptions || fallbackFilterConfig

    const handleDropdownToggle = (filterKey: string) => {
        setOpenDropdown(openDropdown === filterKey ? null : filterKey)
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <DropdownFilter
                label="Category"
                options={config.categories}
                selectedValues={pendingFilters.category || []}
                onChange={(value: string) => onFilterChange('category', value)}
                isOpen={openDropdown === 'category'}
                onToggle={() => handleDropdownToggle('category')}
            />
            <DropdownFilter
                label="Brand"
                options={config.brands}
                selectedValues={pendingFilters.brand || []}
                onChange={(value: string) => onFilterChange('brand', value)}
                isOpen={openDropdown === 'brand'}
                onToggle={() => handleDropdownToggle('brand')}
            />
            <DropdownFilter
                label="Frame Material"
                options={config.frameMaterials}
                selectedValues={pendingFilters.frameMaterial || []}
                onChange={(value: string) => onFilterChange('frameMaterial', value)}
                isOpen={openDropdown === 'frameMaterial'}
                onToggle={() => handleDropdownToggle('frameMaterial')}
            />
            <DropdownFilter
                label="Brake Type"
                options={config.brakeTypes}
                selectedValues={pendingFilters.brakeType || []}
                onChange={(value: string) => onFilterChange('brakeType', value)}
                isOpen={openDropdown === 'brakeType'}
                onToggle={() => handleDropdownToggle('brakeType')}
            />
            <DropdownFilter
                label="Frame Size"
                options={config.frameSizes}
                selectedValues={pendingFilters.frameSize || []}
                onChange={(value: string) => onFilterChange('frameSize', value)}
                isOpen={openDropdown === 'frameSize'}
                onToggle={() => handleDropdownToggle('frameSize')}
            />
            <DropdownFilter
                label="Wheel Size"
                options={config.wheelSizes}
                selectedValues={pendingFilters.wheelSize || []}
                onChange={(value: string) => onFilterChange('wheelSize', value)}
                isOpen={openDropdown === 'wheelSize'}
                onToggle={() => handleDropdownToggle('wheelSize')}
            />
            <DropdownFilter
                label="Gear Type"
                options={config.gearTypes || ["Single Speed", "7-Speed", "21-Speed", "24-Speed"]}
                selectedValues={pendingFilters.gearType || []}
                onChange={(value: string) => onFilterChange('gearType', value)}
                isOpen={openDropdown === 'gearType'}
                onToggle={() => handleDropdownToggle('gearType')}
            />
        </div>
    )
})

FilterDropdownGrid.displayName = 'FilterDropdownGrid'

export default FilterDropdownGrid
