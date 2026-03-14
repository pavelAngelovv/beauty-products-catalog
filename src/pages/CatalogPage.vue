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