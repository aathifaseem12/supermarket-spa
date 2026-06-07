<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Product, ProductResponse } from '../types';
import ProductCard from '../components/ProductCard.vue';

const products = ref<Product[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('All'); // Tracks the currently clicked category
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=30');
    const data: ProductResponse = await res.json();
    
    // Keeps your currency conversion logic intact!
    products.value = data.products.map(p => ({
      ...p,
      price: Math.round(p.price * 300)
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
});

// 1. Automatically extracts unique categories from your loaded product data
const categories = computed(() => {
  const list = products.value.map(p => p.category);
  return ['All', ...new Set(list)]; // Returns ['All', 'groceries', etc.]
});

// 2. Filters products based on BOTH the search box AND the selected category button
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value === 'All' || p.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    
    <div class="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <h1 class="text-3xl font-bold dark:text-white">Fresh Groceries</h1>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search products..." 
        class="w-full md:w-72 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>

    <div class="mb-8 flex flex-wrap gap-2">
      <button 
        v-for="category in categories" 
        :key="category"
        @click="selectedCategory = category"
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors',
          selectedCategory === category 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        ]"
      >
        {{ category }}
      </button>
    </div>

    <div v-if="loading" class="text-center text-xl py-10 dark:text-white">
      Loading products...
    </div>

    <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product" 
      />
    </div>

    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10 text-lg">
      No products found matching your selection.
    </div>

  </div>
</template>