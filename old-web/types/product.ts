export interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  brand: string
  category: string
  color: Array<{
    name: string
    hex: string
    _id: string
  }>
  images: string[]
  frameMaterial: string
  weight: string
  gearType: string
  numberOfGears?: number
  brakeType: string
  frameSize: string
  wheelSize: string
  stock: number
  slug: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface FeaturedProducts {
  _id : string,
  name : string,
  price : number,
  originalPrice?: number,
  brand: string,
  category: string,
  images: string[],
  slug: string,
  createdAt: string
}

export interface ProductsResponse {
  message: string
  data: {
    products: Product[]
    pagination: {
      currentPage: number
      totalPages: number
      totalProducts: number
      limit: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
    appliedFilters: {
      brand?: string[]
      category?: string[]
      frameMaterial?: string[]
      brakeType?: string[]
      frameSize?: string[]
      wheelSize?: string[]
      gearType?: string[]
      featured?: boolean
    }
    search?: string
    sortBy: string
    sortOrder: string
  }
}

export interface FilterOptions {
  message: string
  config: {
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
  }
}

export interface FilterState {
  brand: string[]
  category: string[]
  frameMaterial: string[]
  brakeType: string[]
  frameSize: string[]
  wheelSize: string[]
  gearType: string[]
  color: string[]
  featured?: boolean
}

export interface SearchState {
  query: string
  sortBy: 'createdAt' | 'updatedAt' | 'price' | 'name'
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
}

export interface ProductBySlugResponse {
  message: string
  data: {
    product: Product
  }
}

export interface ProductsAPIParams {
  page?: number
  limit?: number
  search?: string
  brand?: string[]
  category?: string[]
  frameMaterial?: string[]
  brakeType?: string[]
  frameSize?: string[]
  wheelSize?: string[]
  gearType?: string[]
  color?: string[]
  sortBy?: string
  sortOrder?: string
  featured?: boolean
}

export interface RelatedProductsResponse {
  message: string
  data: Product[]
}

export interface FeaturedProductsResponse {
  message: string
  data: {
    featuredProducts: FeaturedProducts[],
    count: number
  }
}

export interface Review {
  _id: string
  reviewerName: string
  address: string
  cycleName: string
  comment: string
  rating: number
  createdAt: string
  cycleId: {
    name: string
    brand: string
  }
}

export interface ReviewsResponse {
  message: string
  data: Review[]
}