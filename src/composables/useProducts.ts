import { ref } from 'vue'
import type { Product, PaginatedProducts } from '../types/product'

export function useProducts() {
  const products = ref<Product[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

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

  return { products, total, isLoading, error, fetchProducts }
}
