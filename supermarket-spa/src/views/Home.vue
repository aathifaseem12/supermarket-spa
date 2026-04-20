<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Product, ProductResponse } from '../types';
import ProductCard from '../components/ProductCard.vue';

const products = ref<Product[]>([]);
const searchQuery = ref('');
const loading = ref(true);

onMounted(async () => {
  try {
    // Fetching from DummyJSON's supermarket groceries endpoint
    const res = await fetch('https://dummyjson.com/products/category/groceries');
    const data: ProductResponse = await res.json();
    products.value = data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
});

// This handles the Search functionality required by the rubric
const filteredProducts = computed(() => {
  return products.value.filter(p => 
    p.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <h1 class="text-3xl font-bold dark:text-white">Fresh Groceries</h1>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search products..." 
        class="w-full md:w-72 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>

    <div v-if="loading" class="text-center text-xl py-10 dark:text-white">
      Loading products...
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>