<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '../types/product'

type StarType = 'full' | 'half' | 'empty'

const props = defineProps<{ product: Product }>()

const discountedPrice = computed(() =>
  (props.product.price * (1 - props.product.discountPercentage / 100)).toFixed(2),
)

function getStars(rating: number) {
  const stars: StarType[] = []
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
        <span v-for="(type, i) in getStars(product.rating)" :key="i" :class="['star', type]">
          <span v-if="type === 'half'" class="star-half-wrap">
            <span class="star-half-filled">★</span>
            <span class="star empty">☆</span>
          </span>
          <span v-else>{{ type === 'full' ? '★' : '☆' }}</span>
        </span>
        <span class="rating-value">{{ product.rating.toFixed(2) }}</span>
        <span class="rating-count">({{ product.reviews.length }})</span>
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

<style scoped>
.card {
  border-radius: 2px;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-img-wrap {
  background: #fff;
  aspect-ratio: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f0f0f0;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 24px;
  box-sizing: border-box;
  transition: transform 0.3s;
}

.card-body {
  padding: 16px 16px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-title {
  font-size: 15px;
  color: #111;
  font-weight: 500;
  line-height: 1.3;
  margin: 0;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 1px;
}

.star {
  font-size: 13px;
}

.star.full {
  color: #000000;
}

.star-half-wrap {
  position: relative;
  display: inline-block;
}

.star-half-filled {
  color: #000000;
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  overflow: hidden;
  display: inline-block;
}

.star.empty {
  color: #000000;
}

.rating-value {
  color: #333;
  font-size: 15px;
  margin-left: 10px;
}

.rating-count {
  color: #000000;
  font-size: 13px;
}

.card-category {
  font-size: 13px;
  color: #888;
  text-transform: capitalize;
}

.card-prices {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 20px;
}

.price-original {
  font-size: 16px;
  color: #000000;
  text-decoration: line-through;
}

.price-current {
  font-size: 16px;
  font-weight: 700;
  color: #111;
}

.card-footer {
  padding: 12px 16px 16px;
}

.add-to-cart {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  background: #fff;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  border-radius: 2px;
  letter-spacing: 0.03em;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}

.add-to-cart:hover {
  background: #111;
  color: #fff;
  border-color: #111;
}
</style>
