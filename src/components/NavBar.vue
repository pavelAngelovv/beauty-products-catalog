<script setup lang="ts">
import logoUrl from '../assets/logo.png'
</script>

<template>
  <header class="nav">
    <nav class="nav-links">
      <a href="#">Bestsellers</a>
      <a href="#">News &amp; Featured</a>
      <a href="#">Skincare</a>
      <a href="#">Body + Hair</a>
      <a href="#">Make-up</a>
    </nav>
    <div class="nav-logo">
      <img :src="logoUrl" alt="Logo" class="logo-img" />
    </div>
  </header>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  padding: 0 48px;
  height: 56px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-links a {
  font-size: 13px;
  color: #111;
  text-decoration: none;
  letter-spacing: 0.02em;
}

.nav-links a:hover {
  text-decoration: underline;
}

.nav-logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.logo-img {
  height: 52px;
  width: auto;
  display: block;
}
</style>
