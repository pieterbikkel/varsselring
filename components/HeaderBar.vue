<template>
  <header class="header px-4 py-2 bg-white shadow mb-6">
    <div class="flex items-center gap-4">
      <NuxtLink to="/" style="text-decoration: none;">
        <h1>Varsselring 2025</h1>
      </NuxtLink>
    </div>
    <nav class="links flex gap-4">
      <NuxtLink to="/" class="nav-btn" active-class="active">Zoeken</NuxtLink>
      <NuxtLink to="/rijders" class="nav-btn" active-class="active">Rijders</NuxtLink>
        <NuxtLink to="/schema" class="nav-btn" active-class="active">Schema</NuxtLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useHead } from '#imports';
// Geen extra script nodig
useHead({
    title: 'Zoek een rijder | Varsselring',
    link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
    ]
});
</script>

<style scoped>
.header {
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  column-gap: 2rem;
  height: 100%;
  align-items: center;

  .links {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
  }
}
.nav-btn {
  padding: 0.4rem 1rem;
  border-radius: 0.375rem;
  color: #1e293b;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.nav-btn:hover,
.nav-btn.active {
  background: #e0e7ef;
  color: #1e40af;
}
</style>
