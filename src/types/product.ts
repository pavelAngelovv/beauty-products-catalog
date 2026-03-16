export interface Product {
  id: number
  title: string
  price: number
  discountPercentage: number
  rating: number
  category: string
  thumbnail: string
  reviews: { rating: number }[]
}

export interface PaginatedProducts {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductCategory {
  slug: string
  name: string
}
