export interface Cycle {
  _id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  description: string
  rating: number
  stock: number
  gearType: string
  brakeType: string
  frameSize: string
  wheelSize: string
  color: string
  slug?: string
  availableColors: {
    name: string
    value: string
    image: string
  }[]
  sizeChart: {
    frameSize: string
    riderHeight: string
    inseam: string
    recommended: boolean
  }[]
}

export const cycles: Cycle[] = [
  {
    _id: "1",
    name: "Mountain Explorer Pro",
    brand: "TrailMaster",
    price: 45000,
    originalPrice: 52000,
    image: "/placeholder.jpg",
    category: "Mountain",
    description:
      "Built for the most challenging terrains, this mountain bike features a lightweight aluminum frame, advanced suspension system, and precision engineering for ultimate performance on trails and rocky paths.",
    rating: 4.8,
    stock: 5,
    gearType: "21-Speed",
    brakeType: "Disc Brake",
    frameSize: 'Large (19")',
    wheelSize: '27.5"',
    color: "Neon Yellow",
    availableColors: [
      { name: "Neon Yellow", value: "#FFFF00", image: "/placeholder.jpg" },
      { name: "Electric Blue", value: "#0080FF", image: "/placeholder.jpg" },
      { name: "Fire Red", value: "#FF4500", image: "/placeholder.jpg" },
      { name: "Forest Green", value: "#228B22", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Small (15")', riderHeight: "5'0\" - 5'4\"", inseam: '27" - 30"', recommended: false },
      { frameSize: 'Medium (17")', riderHeight: "5'4\" - 5'8\"", inseam: '29" - 32"', recommended: false },
      { frameSize: 'Large (19")', riderHeight: "5'8\" - 6'0\"", inseam: '31" - 34"', recommended: true },
      { frameSize: 'X-Large (21")', riderHeight: "6'0\" - 6'4\"", inseam: '33" - 36"', recommended: false },
    ],
  },
  {
    _id: "2",
    name: "Urban Commuter Elite",
    brand: "CityRide",
    price: 28000,
    originalPrice: 32000,
    image: "/placeholder.jpg",
    category: "Hybrid",
    description:
      "Perfect for city commuting with a comfortable upright riding position, integrated lights, and a smooth gear system. Designed for efficiency and comfort in urban environments.",
    rating: 4.6,
    stock: 8,
    gearType: "7-Speed",
    brakeType: "V-Brake",
    frameSize: 'Medium (17")',
    wheelSize: "700c",
    color: "Midnight Black",
    availableColors: [
      { name: "Midnight Black", value: "#000000", image: "/placeholder.jpg" },
      { name: "Pearl White", value: "#F8F8FF", image: "/placeholder.jpg" },
      { name: "Silver Gray", value: "#C0C0C0", image: "/placeholder.jpg" },
      { name: "Navy Blue", value: "#000080", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Small (15")', riderHeight: "5'2\" - 5'6\"", inseam: '28" - 31"', recommended: false },
      { frameSize: 'Medium (17")', riderHeight: "5'6\" - 5'10\"", inseam: '30" - 33"', recommended: true },
      { frameSize: 'Large (19")', riderHeight: "5'10\" - 6'2\"", inseam: '32" - 35"', recommended: false },
    ],
  },
  {
    _id: "3",
    name: "Speed Demon Racing",
    brand: "VelocityMax",
    price: 65000,
    originalPrice: 75000,
    image: "/placeholder.jpg",
    category: "Road",
    description:
      "Engineered for speed and performance with an aerodynamic carbon fiber frame, precision components, and ultra-lightweight design for competitive cycling and long-distance rides.",
    rating: 4.9,
    stock: 3,
    gearType: "16-Speed",
    brakeType: "Caliper Brake",
    frameSize: "Medium (54cm)",
    wheelSize: "700c",
    color: "Carbon Black",
    availableColors: [
      { name: "Carbon Black", value: "#36454F", image: "/placeholder.jpg" },
      { name: "Racing Red", value: "#DC143C", image: "/placeholder.jpg" },
      { name: "Electric Yellow", value: "#FFFF33", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: "Small (50cm)", riderHeight: "5'3\" - 5'6\"", inseam: '29" - 31"', recommended: false },
      { frameSize: "Medium (54cm)", riderHeight: "5'6\" - 5'9\"", inseam: '31" - 33"', recommended: true },
      { frameSize: "Large (58cm)", riderHeight: "5'9\" - 6'1\"", inseam: '33" - 35"', recommended: false },
    ],
  },
  {
    _id: "4",
    name: "Adventure Seeker",
    brand: "ExploreMore",
    price: 38000,
    image: "/placeholder.jpg",
    category: "Hybrid",
    description:
      "Versatile hybrid bike perfect for both city streets and light trail adventures. Features comfortable geometry and reliable components for everyday riding.",
    rating: 4.5,
    stock: 12,
    gearType: "18-Speed",
    brakeType: "Disc Brake",
    frameSize: 'Large (19")',
    wheelSize: "700c",
    color: "Adventure Green",
    availableColors: [
      { name: "Adventure Green", value: "#228B22", image: "/placeholder.jpg" },
      { name: "Sunset Orange", value: "#FF8C00", image: "/placeholder.jpg" },
      { name: "Sky Blue", value: "#87CEEB", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Medium (17")', riderHeight: "5'4\" - 5'8\"", inseam: '29" - 32"', recommended: false },
      { frameSize: 'Large (19")', riderHeight: "5'8\" - 6'0\"", inseam: '31" - 34"', recommended: true },
      { frameSize: 'X-Large (21")', riderHeight: "6'0\" - 6'3\"", inseam: '33" - 36"', recommended: false },
    ],
  },
  {
    _id: "5",
    name: "Little Explorer",
    brand: "KidsCycle",
    price: 15000,
    originalPrice: 18000,
    image: "/placeholder.jpg",
    category: "Kids",
    description:
      "Safe and fun bicycle designed specifically for young riders. Features training wheels, adjustable seat, and bright colors to make learning to ride exciting.",
    rating: 4.7,
    stock: 15,
    gearType: "Single Speed",
    brakeType: "Coaster Brake",
    frameSize: '12"',
    wheelSize: '16"',
    color: "Bright Pink",
    availableColors: [
      { name: "Bright Pink", value: "#FF69B4", image: "/placeholder.jpg" },
      { name: "Royal Blue", value: "#4169E1", image: "/placeholder.jpg" },
      { name: "Sunshine Yellow", value: "#FFD700", image: "/placeholder.jpg" },
      { name: "Lime Green", value: "#32CD32", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: '10"', riderHeight: "3'0\" - 3'6\"", inseam: '14" - 17"', recommended: false },
      { frameSize: '12"', riderHeight: "3'6\" - 4'0\"", inseam: '16" - 20"', recommended: true },
      { frameSize: '14"', riderHeight: "4'0\" - 4'6\"", inseam: '18" - 22"', recommended: false },
    ],
  },
  {
    _id: "6",
    name: "Trail Blazer X1",
    brand: "MountainKing",
    price: 55000,
    image: "/placeholder.jpg",
    category: "Mountain",
    description:
      "Professional-grade mountain bike with full suspension, premium components, and rugged construction for serious trail riding and mountain adventures.",
    rating: 4.8,
    stock: 4,
    gearType: "24-Speed",
    brakeType: "Hydraulic Disc",
    frameSize: 'Large (19")',
    wheelSize: '29"',
    color: "Stealth Black",
    availableColors: [
      { name: "Stealth Black", value: "#2F2F2F", image: "/placeholder.jpg" },
      { name: "Titanium Gray", value: "#708090", image: "/placeholder.jpg" },
      { name: "Electric Orange", value: "#FF6600", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Medium (17")', riderHeight: "5'6\" - 5'10\"", inseam: '30" - 33"', recommended: false },
      { frameSize: 'Large (19")', riderHeight: "5'10\" - 6'2\"", inseam: '32" - 35"', recommended: true },
      { frameSize: 'X-Large (21")', riderHeight: "6'2\" - 6'6\"", inseam: '34" - 37"', recommended: false },
    ],
  },
  {
    _id: "7",
    name: "Trail Blazer X1",
    brand: "MountainKing",
    price: 55000,
    image: "/placeholder.jpg",
    category: "Mountain",
    description:
      "Professional-grade mountain bike with full suspension, premium components, and rugged construction for serious trail riding and mountain adventures.",
    rating: 4.8,
    stock: 4,
    gearType: "24-Speed",
    brakeType: "Hydraulic Disc",
    frameSize: 'Large (19")',
    wheelSize: '29"',
    color: "Stealth Black",
    availableColors: [
      { name: "Stealth Black", value: "#2F2F2F", image: "/placeholder.jpg" },
      { name: "Titanium Gray", value: "#708090", image: "/placeholder.jpg" },
      { name: "Electric Orange", value: "#FF6600", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Medium (17")', riderHeight: "5'6\" - 5'10\"", inseam: '30" - 33"', recommended: false },
      { frameSize: 'Large (19")', riderHeight: "5'10\" - 6'2\"", inseam: '32" - 35"', recommended: true },
      { frameSize: 'X-Large (21")', riderHeight: "6'2\" - 6'6\"", inseam: '34" - 37"', recommended: false },
    ],
  },
  {
    _id: "8",
    name: "Trail Blazer X1",
    brand: "MountainKing",
    price: 55000,
    image: "/placeholder.jpg",
    category: "Mountain",
    description:
      "Professional-grade mountain bike with full suspension, premium components, and rugged construction for serious trail riding and mountain adventures.",
    rating: 4.8,
    stock: 4,
    gearType: "24-Speed",
    brakeType: "Hydraulic Disc",
    frameSize: 'Large (19")',
    wheelSize: '29"',
    color: "Stealth Black",
    availableColors: [
      { name: "Stealth Black", value: "#2F2F2F", image: "/placeholder.jpg" },
      { name: "Titanium Gray", value: "#708090", image: "/placeholder.jpg" },
      { name: "Electric Orange", value: "#FF6600", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Medium (17")', riderHeight: "5'6\" - 5'10\"", inseam: '30" - 33"', recommended: false },
      { frameSize: 'Large (19")', riderHeight: "5'10\" - 6'2\"", inseam: '32" - 35"', recommended: true },
      { frameSize: 'X-Large (21")', riderHeight: "6'2\" - 6'6\"", inseam: '34" - 37"', recommended: false },
    ],
  },
  {
    _id: "9",
    name: "Trail Blazer X1",
    brand: "MountainKing",
    price: 55000,
    image: "/placeholder.jpg",
    category: "Mountain",
    description:
      "Professional-grade mountain bike with full suspension, premium components, and rugged construction for serious trail riding and mountain adventures.",
    rating: 4.8,
    stock: 4,
    gearType: "24-Speed",
    brakeType: "Hydraulic Disc",
    frameSize: 'Large (19")',
    wheelSize: '29"',
    color: "Stealth Black",
    availableColors: [
      { name: "Stealth Black", value: "#2F2F2F", image: "/placeholder.jpg" },
      { name: "Titanium Gray", value: "#708090", image: "/placeholder.jpg" },
      { name: "Electric Orange", value: "#FF6600", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Medium (17")', riderHeight: "5'6\" - 5'10\"", inseam: '30" - 33"', recommended: false },
      { frameSize: 'Large (19")', riderHeight: "5'10\" - 6'2\"", inseam: '32" - 35"', recommended: true },
      { frameSize: 'X-Large (21")', riderHeight: "6'2\" - 6'6\"", inseam: '34" - 37"', recommended: false },
    ],
  },
  {
    _id: "10",
    name: "Trail Blazer X1",
    brand: "MountainKing",
    price: 55000,
    image: "/placeholder.jpg",
    category: "Mountain",
    description:
      "Professional-grade mountain bike with full suspension, premium components, and rugged construction for serious trail riding and mountain adventures.",
    rating: 4.8,
    stock: 4,
    gearType: "24-Speed",
    brakeType: "Hydraulic Disc",
    frameSize: 'Large (19")',
    wheelSize: '29"',
    color: "Stealth Black",
    availableColors: [
      { name: "Stealth Black", value: "#2F2F2F", image: "/placeholder.jpg" },
      { name: "Titanium Gray", value: "#708090", image: "/placeholder.jpg" },
      { name: "Electric Orange", value: "#FF6600", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Medium (17")', riderHeight: "5'6\" - 5'10\"", inseam: '30" - 33"', recommended: false },
      { frameSize: 'Large (19")', riderHeight: "5'10\" - 6'2\"", inseam: '32" - 35"', recommended: true },
      { frameSize: 'X-Large (21")', riderHeight: "6'2\" - 6'6\"", inseam: '34" - 37"', recommended: false },
    ],
  },
  {
    _id: "11",
    name: "Trail Blazer X1",
    brand: "MountainKing",
    price: 55000,
    image: "/placeholder.jpg",
    category: "Mountain",
    description:
      "Professional-grade mountain bike with full suspension, premium components, and rugged construction for serious trail riding and mountain adventures.",
    rating: 4.8,
    stock: 4,
    gearType: "24-Speed",
    brakeType: "Hydraulic Disc",
    frameSize: 'Large (19")',
    wheelSize: '29"',
    color: "Stealth Black",
    availableColors: [
      { name: "Stealth Black", value: "#2F2F2F", image: "/placeholder.jpg" },
      { name: "Titanium Gray", value: "#708090", image: "/placeholder.jpg" },
      { name: "Electric Orange", value: "#FF6600", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Medium (17")', riderHeight: "5'6\" - 5'10\"", inseam: '30" - 33"', recommended: false },
      { frameSize: 'Large (19")', riderHeight: "5'10\" - 6'2\"", inseam: '32" - 35"', recommended: true },
      { frameSize: 'X-Large (21")', riderHeight: "6'2\" - 6'6\"", inseam: '34" - 37"', recommended: false },
    ],
  },
  {
    _id: "12",
    name: "Trail Blazer X1",
    brand: "MountainKing",
    price: 55000,
    image: "/placeholder.jpg",
    category: "Mountain",
    description:
      "Professional-grade mountain bike with full suspension, premium components, and rugged construction for serious trail riding and mountain adventures.",
    rating: 4.8,
    stock: 4,
    gearType: "24-Speed",
    brakeType: "Hydraulic Disc",
    frameSize: 'Large (19")',
    wheelSize: '29"',
    color: "Stealth Black",
    availableColors: [
      { name: "Stealth Black", value: "#2F2F2F", image: "/placeholder.jpg" },
      { name: "Titanium Gray", value: "#708090", image: "/placeholder.jpg" },
      { name: "Electric Orange", value: "#FF6600", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Medium (17")', riderHeight: "5'6\" - 5'10\"", inseam: '30" - 33"', recommended: false },
      { frameSize: 'Large (19")', riderHeight: "5'10\" - 6'2\"", inseam: '32" - 35"', recommended: true },
      { frameSize: 'X-Large (21")', riderHeight: "6'2\" - 6'6\"", inseam: '34" - 37"', recommended: false },
    ],
  },
  {
    _id: "13",
    name: "Trail Blazer X1",
    brand: "MountainKing",
    price: 55000,
    image: "/placeholder.jpg",
    category: "Mountain",
    description:
      "Professional-grade mountain bike with full suspension, premium components, and rugged construction for serious trail riding and mountain adventures.",
    rating: 4.8,
    stock: 4,
    gearType: "24-Speed",
    brakeType: "Hydraulic Disc",
    frameSize: 'Large (19")',
    wheelSize: '29"',
    color: "Stealth Black",
    availableColors: [
      { name: "Stealth Black", value: "#2F2F2F", image: "/placeholder.jpg" },
      { name: "Titanium Gray", value: "#708090", image: "/placeholder.jpg" },
      { name: "Electric Orange", value: "#FF6600", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Medium (17")', riderHeight: "5'6\" - 5'10\"", inseam: '30" - 33"', recommended: false },
      { frameSize: 'Large (19")', riderHeight: "5'10\" - 6'2\"", inseam: '32" - 35"', recommended: true },
      { frameSize: 'X-Large (21")', riderHeight: "6'2\" - 6'6\"", inseam: '34" - 37"', recommended: false },
    ],
  },
  {
    _id: "14",
    name: "Trail Blazer X1",
    brand: "MountainKing",
    price: 55000,
    image: "/placeholder.jpg",
    category: "Mountain",
    description:
      "Professional-grade mountain bike with full suspension, premium components, and rugged construction for serious trail riding and mountain adventures.",
    rating: 4.8,
    stock: 4,
    gearType: "24-Speed",
    brakeType: "Hydraulic Disc",
    frameSize: 'Large (19")',
    wheelSize: '29"',
    color: "Stealth Black",
    availableColors: [
      { name: "Stealth Black", value: "#2F2F2F", image: "/placeholder.jpg" },
      { name: "Titanium Gray", value: "#708090", image: "/placeholder.jpg" },
      { name: "Electric Orange", value: "#FF6600", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Medium (17")', riderHeight: "5'6\" - 5'10\"", inseam: '30" - 33"', recommended: false },
      { frameSize: 'Large (19")', riderHeight: "5'10\" - 6'2\"", inseam: '32" - 35"', recommended: true },
      { frameSize: 'X-Large (21")', riderHeight: "6'2\" - 6'6\"", inseam: '34" - 37"', recommended: false },
    ],
  },
  {
    _id: "15",
    name: "Trail Blazer X1",
    brand: "MountainKing",
    price: 55000,
    image: "/placeholder.jpg",
    category: "Mountain",
    description:
      "Professional-grade mountain bike with full suspension, premium components, and rugged construction for serious trail riding and mountain adventures.",
    rating: 4.8,
    stock: 4,
    gearType: "24-Speed",
    brakeType: "Hydraulic Disc",
    frameSize: 'Large (19")',
    wheelSize: '29"',
    color: "Stealth Black",
    availableColors: [
      { name: "Stealth Black", value: "#2F2F2F", image: "/placeholder.jpg" },
      { name: "Titanium Gray", value: "#708090", image: "/placeholder.jpg" },
      { name: "Electric Orange", value: "#FF6600", image: "/placeholder.jpg" },
    ],
    sizeChart: [
      { frameSize: 'Medium (17")', riderHeight: "5'6\" - 5'10\"", inseam: '30" - 33"', recommended: false },
      { frameSize: 'Large (19")', riderHeight: "5'10\" - 6'2\"", inseam: '32" - 35"', recommended: true },
      { frameSize: 'X-Large (21")', riderHeight: "6'2\" - 6'6\"", inseam: '34" - 37"', recommended: false },
    ],
  },
]

export const categories = [
  { name: "Mountain", count: 2, image: "/placeholder.jpg" },
  { name: "Road", count: 1, image: "/placeholder.jpg" },
  { name: "Hybrid", count: 2, image: "/placeholder.jpg" },
  { name: "Kids", count: 1, image: "/placeholder.jpg" },
]
