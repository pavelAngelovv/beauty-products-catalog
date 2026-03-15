<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/ProductCard.vue'

const LIMIT = 12

const { products, total, isLoading, error, fetchProducts } = useProducts()

onMounted(() => {
  fetchProducts(0, LIMIT)
})

const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(total.value / LIMIT))

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchProducts((page - 1) * LIMIT, LIMIT)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const pageNumbers = computed(() => {
  const pages = []

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

    <div v-if="isLoading" class="state-msg">Loading...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
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
  font-family: Georgia, serif;
  font-size: 36px;
  font-weight: 400;
  text-align: center;
  margin: 48px 0 32px;
  color: #111;
  letter-spacing: 0.01em;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
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
  color: #000000
}

.page-btn:disabled {
  color: #ccc;
  border-color: #eee;
  cursor: not-allowed;
}

.page-btn.arrow {
  font-size: 18px;
  line-height: 1;
}

.page-btn.arrow:nth-child(2) {
  margin-right: 18px;
}

.page-btn.arrow:nth-child(6) {
  margin-left: 18px;
}
</style>
