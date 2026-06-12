<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Product, ProductResponse } from '../types';
import ProductCard from '../components/ProductCard.vue';

const products = ref<Product[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('All');
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=50');
    const data: ProductResponse = await res.json();
    
    products.value = data.products.map(p => {
      const titleLower = p.title.toLowerCase();
      const catLower = p.category.toLowerCase();
      
      // 1. Everything defaults to Household first (Perfect for oil, eggs, pans, powder)
      let assignedCategory = 'Household'; 

      // 2. Ultra-Strict Sorting Logic
      if (catLower === 'beauty' || catLower === 'fragrances' || titleLower.includes('soap') || titleLower.includes('shampoo')) {
        assignedCategory = 'Beauty & Fragrances';
      } 
      else if (titleLower.includes('bread') || titleLower.includes('croissant') || titleLower.includes('cake') || titleLower.includes('bun') || titleLower.includes('biscuit')) {
        assignedCategory = 'Bakery'; // Strictly baked goods only!
      } 
      else if (titleLower.includes('water') || titleLower.includes('juice') || titleLower.includes('milk') || titleLower.includes('cola') || titleLower.includes('soda') || titleLower.includes('drink') || titleLower.includes('coffee')) {
        assignedCategory = 'Beverages';
      } 
      else if (titleLower.includes('chicken') || titleLower.includes('meat') || titleLower.includes('fish') || titleLower.includes('beef') || titleLower.includes('tuna') || titleLower.includes('steak')) {
        assignedCategory = 'Meats & Fish';
      } 
      else if (titleLower.includes('apple') || titleLower.includes('banana') || titleLower.includes('berry') || titleLower.includes('fruit') || titleLower.includes('kiwi') || titleLower.includes('lemon')) {
        assignedCategory = 'Fruits';
      } 
      else if (titleLower.includes('pet') || titleLower.includes('dog') || titleLower.includes('cat') || titleLower.includes('bird')) {
        assignedCategory = 'Pet Care';
      }

      return {
        ...p,
        category: assignedCategory,
        price: Math.round(p.price * 300) 
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
});

// Auto-generates the text pill buttons
const categories = computed(() => {
  const list = products.value.map(p => p.category);
  return ['All', ...new Set(list)];
});

// Search and filter logic
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
          'px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors shadow-sm',
          selectedCategory === category 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
        ]"
      >
        {{ category }}
      </button>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4 animate-pulse">
      <div class="relative w-16 h-16 flex items-center justify-center">
        <div class="absolute inset-0 border-4 border-blue-100 dark:border-gray-700 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 tracking-wide">Gathering Fresh Stock...</h3>
    </div>

    <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product" 
      />
    </div>

    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10 text-lg">
      No items matching your selection could be found.
    </div>

  </div>
</template>