export interface AdminProduct {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  category: string
  stock: number
  gearType: string
  brakeType: string
  frameSize: string
  wheelSize: string
  color: string
  description: string
  rating: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface CycleRequest {
  id: number
  requesterName: string
  mobileNumber: string
  cycleName: string
  cycleId: number
  dateSubmitted: string
  dateCompleted?: string
  status: "ongoing" | "completed"
  userBought?: boolean
  notes?: string
}

export interface CustomerReview {
  id: number
  reviewerName: string
  address: string
  cycleName: string
  cycleId: number
  comment: string
  rating: number
  createdAt: string
  updatedAt: string
}

// Mock Products Data
export const mockProducts: AdminProduct[] = [
  {
    id: 1,
    name: "Mountain Explorer Pro",
    brand: "TrailMaster",
    price: 45000,
    originalPrice: 52000,
    image: "/placeholder.jpg",
    category: "Mountain",
    stock: 5,
    gearType: "21-Speed",
    brakeType: "Disc Brake",
    frameSize: 'Large (19")',
    wheelSize: '27.5"',
    color: "Neon Yellow",
    description: "Built for the most challenging terrains, this mountain bike features a lightweight aluminum frame.",
    rating: 4.8,
    featured: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
  },
  {
    id: 2,
    name: "Urban Commuter Elite",
    brand: "CityRide",
    price: 28000,
    originalPrice: 32000,
    image: "/placeholder.jpg",
    category: "Hybrid",
    stock: 8,
    gearType: "7-Speed",
    brakeType: "V-Brake",
    frameSize: 'Medium (17")',
    wheelSize: "700c",
    color: "Midnight Black",
    description: "Perfect for city commuting with a comfortable upright riding position.",
    rating: 4.6,
    featured: true,
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-18T16:20:00Z",
  },
  {
    id: 3,
    name: "Speed Demon Racing",
    brand: "VelocityMax",
    price: 65000,
    originalPrice: 75000,
    image: "/placeholder.jpg",
    category: "Road",
    stock: 3,
    gearType: "16-Speed",
    brakeType: "Caliper Brake",
    frameSize: "Medium (54cm)",
    wheelSize: "700c",
    color: "Carbon Black",
    description: "Engineered for speed and performance with an aerodynamic carbon fiber frame.",
    rating: 4.9,
    featured: false,
    createdAt: "2024-01-05T11:00:00Z",
    updatedAt: "2024-01-22T13:30:00Z",
  },
  {
    id: 4,
    name: "Little Explorer",
    brand: "KidsCycle",
    price: 15000,
    originalPrice: 18000,
    image: "/placeholder.jpg",
    category: "Kids",
    stock: 15,
    gearType: "Single Speed",
    brakeType: "Coaster Brake",
    frameSize: '12"',
    wheelSize: '16"',
    color: "Bright Pink",
    description: "Safe and fun bicycle designed specifically for young riders.",
    rating: 4.7,
    featured: false,
    createdAt: "2024-01-12T08:45:00Z",
    updatedAt: "2024-01-19T12:15:00Z",
  },
  {
    id: 5,
    name: "Trail Blazer X1",
    brand: "MountainKing",
    price: 55000,
    image: "/placeholder.jpg",
    category: "Mountain",
    stock: 4,
    gearType: "24-Speed",
    brakeType: "Hydraulic Disc",
    frameSize: 'Large (19")',
    wheelSize: '29"',
    color: "Stealth Black",
    description: "Professional-grade mountain bike with full suspension.",
    rating: 4.8,
    featured: false,
    createdAt: "2024-01-08T14:20:00Z",
    updatedAt: "2024-01-21T10:50:00Z",
  },
]

// Mock Requests Data
export const mockRequests: CycleRequest[] = [
  {
    id: 1,
    requesterName: "John Doe",
    mobileNumber: "9876543210",
    cycleName: "Mountain Explorer Pro",
    cycleId: 1,
    dateSubmitted: "2024-01-22T10:30:00Z",
    status: "ongoing",
  },
  {
    id: 2,
    requesterName: "Jane Smith",
    mobileNumber: "9123456789",
    cycleName: "Urban Commuter Elite",
    cycleId: 2,
    dateSubmitted: "2024-01-21T14:15:00Z",
    status: "ongoing",
  },
  {
    id: 3,
    requesterName: "Mike Johnson",
    mobileNumber: "9988776655",
    cycleName: "Speed Demon Racing",
    cycleId: 3,
    dateSubmitted: "2024-01-20T09:45:00Z",
    status: "ongoing",
  },
  {
    id: 4,
    requesterName: "Sarah Wilson",
    mobileNumber: "9876512345",
    cycleName: "Little Explorer",
    cycleId: 4,
    dateSubmitted: "2024-01-18T16:20:00Z",
    dateCompleted: "2024-01-20T11:30:00Z",
    status: "completed",
    userBought: true,
    notes: "Customer was very satisfied with the product.",
  },
  {
    id: 5,
    requesterName: "David Brown",
    mobileNumber: "9123987654",
    cycleName: "Trail Blazer X1",
    cycleId: 5,
    dateSubmitted: "2024-01-17T13:10:00Z",
    dateCompleted: "2024-01-19T15:45:00Z",
    status: "completed",
    userBought: false,
    notes: "Customer decided not to purchase due to budget constraints.",
  },
  {
    id: 6,
    requesterName: "Emily Davis",
    mobileNumber: "9567890123",
    cycleName: "Mountain Explorer Pro",
    cycleId: 1,
    dateSubmitted: "2024-01-16T11:25:00Z",
    dateCompleted: "2024-01-18T14:20:00Z",
    status: "completed",
    userBought: true,
    notes: "Quick sale, customer loved the bike.",
  },
]

// Mock Reviews Data
export const mockReviews: CustomerReview[] = [
  {
    id: 1,
    reviewerName: "Rajesh Kumar",
    address: "Mumbai, Maharashtra",
    cycleName: "Mountain Explorer Pro",
    cycleId: 1,
    comment:
      "Excellent quality cycles! I bought a mountain bike for my son and the build quality is outstanding. Great customer service too.",
    rating: 5,
    createdAt: "2024-01-20T12:30:00Z",
    updatedAt: "2024-01-20T12:30:00Z",
  },
  {
    id: 2,
    reviewerName: "Priya Sharma",
    address: "Delhi, NCR",
    cycleName: "Urban Commuter Elite",
    cycleId: 2,
    comment:
      "Love my new city cruiser! Perfect for daily commuting. The team helped me choose the right size and it's been amazing.",
    rating: 5,
    createdAt: "2024-01-19T15:45:00Z",
    updatedAt: "2024-01-19T15:45:00Z",
  },
  {
    id: 3,
    reviewerName: "Amit Patel",
    address: "Bangalore, Karnataka",
    cycleName: "Speed Demon Racing",
    cycleId: 3,
    comment:
      "Great experience buying from CycleStore. Fast delivery and the cycle was exactly as described. Highly recommended!",
    rating: 4,
    createdAt: "2024-01-18T10:20:00Z",
    updatedAt: "2024-01-18T10:20:00Z",
  },
  {
    id: 4,
    reviewerName: "Sneha Reddy",
    address: "Hyderabad, Telangana",
    cycleName: "Little Explorer",
    cycleId: 4,
    comment:
      "Fantastic service! The staff was very knowledgeable and helped me find the perfect women's bike. Quality is top-notch.",
    rating: 5,
    createdAt: "2024-01-17T14:10:00Z",
    updatedAt: "2024-01-17T14:10:00Z",
  },
  {
    id: 5,
    reviewerName: "Vikram Singh",
    address: "Pune, Maharashtra",
    cycleName: "Trail Blazer X1",
    cycleId: 5,
    comment:
      "Been cycling for years and this is one of the best purchases I've made. Smooth ride, great build quality, and excellent value for money.",
    rating: 5,
    createdAt: "2024-01-16T09:30:00Z",
    updatedAt: "2024-01-16T09:30:00Z",
  },
  {
    id: 6,
    reviewerName: "Kavya Nair",
    address: "Chennai, Tamil Nadu",
    cycleName: "Mountain Explorer Pro",
    cycleId: 1,
    comment:
      "My daughter loves her new cycle! Safe, sturdy, and perfect size. The bright colors and smooth ride make it her favorite toy.",
    rating: 4,
    createdAt: "2024-01-15T16:45:00Z",
    updatedAt: "2024-01-15T16:45:00Z",
  },
]
