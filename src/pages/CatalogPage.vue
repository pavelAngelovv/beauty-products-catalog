<script setup lang="ts">
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/ProductCard.vue'

const { products, isLoading, error } = useProducts()
</script>

<template>
    <main class="catalog">
        <h1 class="catalog-title">Products</h1>

        <div v-if="isLoading" class="state-msg">Loading...</div>
        <div v-else-if="error" class="state-msg error">{{ error }}</div>
        <div v-else class="product-grid">
            <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
    </main>
</template>

<style scoped>
.catalog {
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 48px 80px;
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
</style>