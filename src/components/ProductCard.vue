<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '../types/product'

const props = defineProps<{ product: Product }>()

const discountedPrice = computed(() =>
    (props.product.price * (1 - props.product.discountPercentage / 100)).toFixed(2)
)

function getStars(rating: number) {
    const stars = []
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) stars.push('full')
        else if (rating >= i - 0.5) stars.push('half')
        else stars.push('empty')
    }
    return stars
}
</script>

<template>
    <div class="card">
        <div class="card-img-wrap">
            <img :src="product.thumbnail" :alt="product.title" class="card-img" />
        </div>
        <div class="card-body">
            <h3 class="card-title">{{ product.title }}</h3>
            <div class="card-rating">
                <span class="stars">
                    <span v-for="(type, i) in getStars(product.rating)" :key="i" :class="['star', type]">★</span>
                </span>
                <span class="rating-value">{{ product.rating.toFixed(2) }}</span>
            </div>
            <div class="card-category">{{ product.category }}</div>
            <div class="card-prices">
                <span class="price-original">${{ product.price }} USD</span>
                <span class="price-current">${{ discountedPrice }} USD</span>
            </div>
        </div>
        <div class="card-footer">
            <button class="add-to-cart">Add to Cart</button>
        </div>
    </div>
</template>