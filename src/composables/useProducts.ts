import { ref } from 'vue'
import type { Product, PaginatedProducts, ProductCategory } from '../types/product'

export function useProducts() {
  const products = ref<Product[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const categories = ref<ProductCategory[]>([])

  async function fetchCategories() {
    try {
      const res = await fetch('https://dummyjson.com/products/categories')
      const data: ProductCategory[] = await res.json()
      categories.value = data
    } catch (e) {
      error.value = 'Failed to load categories'
    }
  }

  async function fetchProducts(skip = 0, limit = 12) {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
      const data: PaginatedProducts = await res.json()
      products.value = data.products
      total.value = data.total
    } catch (e) {
      error.value = 'Failed to load products'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchByCategory(slug: string, skip = 0, limit = 12) {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch(
        `https://dummyjson.com/products/category/${slug}?limit=${limit}&skip=${skip}`,
      )
      const data: PaginatedProducts = await res.json()
      products.value = data.products
      total.value = data.total
    } catch (e) {
      error.value = 'Failed to load products'
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    total,
    isLoading,
    error,
    categories,
    fetchCategories,
    fetchProducts,
    fetchByCategory,
  }
}
