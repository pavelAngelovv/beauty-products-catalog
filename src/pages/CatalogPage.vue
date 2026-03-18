<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/ProductCard.vue'

const LIMIT = 12

const {
  products,
  total,
  isLoading,
  error,
  categories,
  fetchProducts,
  fetchByCategory,
  fetchCategories,
  fetchBySearch,
} = useProducts()

const currentPage = ref(1)
const selectedCategory = ref<string | null>(null)
const isDropdownOpen = ref(false)
const searchQuery = ref('')
let searchTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  fetchProducts(0, LIMIT)
  fetchCategories()
})

const totalPages = computed(() => Math.ceil(total.value / LIMIT))

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function closeDropdown() {
  isDropdownOpen.value = false
}

function selectCategory(slug: string | null) {
  selectedCategory.value = slug
  currentPage.value = 1
  searchQuery.value = ''
  closeDropdown()

  if (slug === null) {
    fetchProducts(0, LIMIT)
  } else {
    fetchByCategory(slug, 0, LIMIT)
  }
}

function search(query: string) {
  searchQuery.value = query
  currentPage.value = 1
  selectedCategory.value = null
  isDropdownOpen.value = false

  if (searchTimeout) clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    if (query.trim() === '') {
      fetchProducts(0, LIMIT)
    } else {
      fetchBySearch(query, 0, LIMIT)
    }
  }, 400)
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  if (searchQuery.value.trim()) {
    fetchBySearch(searchQuery.value, (page - 1) * LIMIT, LIMIT)
  } else if (selectedCategory.value) {
    fetchByCategory(selectedCategory.value, (page - 1) * LIMIT, LIMIT)
  } else {
    fetchProducts((page - 1) * LIMIT, LIMIT)
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const pageNumbers = computed(() => {
  const pages: number[] = []

  let start = currentPage.value - 1
  let end = currentPage.value + 1

  if (currentPage.value === 1) {
    start = 1
    end = 3
  }

  if (currentPage.value === totalPages.value) {
    start = totalPages.value - 2
    end = totalPages.value
  }

  start = Math.max(1, start)
  end = Math.min(totalPages.value, end)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script>

<template>
  <main class="catalog">
    <h1 class="catalog-title">Products</h1>

    <div class="toolbar">
      <div class="toolbar-left">
        <div class="dropdown">
          <button class="dropdown-btn" @click="toggleDropdown">
            {{ selectedCategory ?? 'Filters' }} <span class="arrow">▾</span>
          </button>
          <div class="dropdown-menu" v-if="isDropdownOpen">
            <button
              :class="['dropdown-item', { active: selectedCategory === null }]"
              @click="selectCategory(null)"
            >
              All
            </button>
            <button
              v-for="category in categories"
              :key="category.slug"
              :class="['dropdown-item', { active: selectedCategory === category.slug }]"
              @click="selectCategory(category.slug)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
        <input
          class="search-input"
          type="text"
          placeholder="Search products..."
          :value="searchQuery"
          @input="search(($event.target as HTMLInputElement).value)"
        />
      </div>

      <span class="results-count">( {{ total }} Results )</span>
    </div>

    <div v-if="isLoading" class="product-grid">
      <div v-for="n in LIMIT" :key="n" class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line medium"></div>
        </div>
        <div class="skeleton-footer">
          <div class="skeleton-line"></div>
        </div>
      </div>
    </div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="products.length === 0" class="empty-state">
      <p>No products found</p>
    </div>
    <div v-else class="product-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button class="page-btn arrow" :disabled="currentPage === 1" @click="goToPage(1)">
        &#8249;&#8249;
      </button>

      <button
        class="page-btn arrow"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        &#8249;
      </button>

      <button
        v-for="page in pageNumbers"
        :key="page"
        :class="['page-btn', { active: page === currentPage }]"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button
        class="page-btn arrow"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        &#8250;
      </button>

      <button
        class="page-btn arrow"
        :disabled="currentPage === totalPages"
        @click="goToPage(totalPages)"
      >
        &#8250;&#8250;
      </button>
    </div>
  </main>
</template>

<style scoped>
.catalog {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 48px 20px;
}

.catalog-title {
  font-size: 36px;
  font-weight: 600;
  text-align: center;
  margin: 48px 0 32px;
  color: #111;
  letter-spacing: 0.01em;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.dropdown {
  position: relative;
}

.dropdown-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 13px;
  color: #111;
  cursor: pointer;
  border-radius: 2px;
  letter-spacing: 0.02em;
  text-transform: capitalize;
  width: 130px;
}

.dropdown-btn:hover {
  border-color: #999;
}

.arrow {
  font-size: 10px;
}

.dropdown-menu {
  position: absolute;
  left: 0;
  min-width: 180px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 2px;
  z-index: 50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-height: 280px;
  overflow-y: auto;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 9px 14px;
  text-align: left;
  background: none;
  border: none;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  text-transform: capitalize;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.active {
  font-weight: 600;
  color: #111;
}

.search-input {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 13px;
  color: #111;
  cursor: text;
  border-radius: 2px;
  letter-spacing: 0.02em;
  width: 120px;
  outline: none;
}

.search-input:focus {
  border-color: #999;
}

.search-input::placeholder {
  color: #aaa;
  font-weight: 300;
}

.results-count {
  font-size: 13px;
  color: #888;
  letter-spacing: 0.02em;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 34px;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #888;
  font-size: 15px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 48px;
}

.page-btn {
  height: 36px;
  padding: 0px;
  border: none;
  background: #fff;
  font-size: 14px;
  color: #8f8f8f;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.15s;
  font-weight: 300;
}

.page-btn:hover:not(:disabled) {
  border-color: #999;
  color: #111;
}

.page-btn.active {
  font-weight: 900;
  color: #000000;
}

.page-btn:disabled {
  color: #ccc;
  border-color: #eee;
  cursor: not-allowed;
}

.page-btn.arrow {
  font-size: 23px;
  line-height: 1;
  margin-top: -6px;
}

.page-btn.arrow:nth-child(2) {
  margin-right: 18px;
}

.page-btn.arrow:nth-child(6) {
  margin-left: 18px;
}

.skeleton-card {
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  background: #fff;
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 400px;
  animation: shimmer 1.2s infinite;
}

.skeleton-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-footer {
  padding: 12px 16px 16px;
}

.skeleton-line {
  height: 12px;
  border-radius: 2px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 400px;
  animation: shimmer 1.2s infinite;
}

.skeleton-line.short {
  width: 35%;
}

.skeleton-line.medium {
  width: 55%;
}

@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  .results-count {
    display: none;
  }
}
</style>
