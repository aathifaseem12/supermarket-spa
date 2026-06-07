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
    // Fetching 30 items so we get a good mix of categories
    const res = await fetch('https://dummyjson.com/products?limit=30');
    const data: ProductResponse = await res.json();
    
    // Keep your Sri Lankan price conversion rate logic
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

// A map linking API categories to clean grocery-style images
const categoryImages: Record<string, string> = {
  'All': 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png', // Shop icon
  'beauty': 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=150&auto=format&fit=crop&q=60', 
  'fragrances': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&auto=format&fit=crop&q=60',
  'furniture': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=150&auto=format&fit=crop&q=60',
  'groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=60'
};

// Auto-extract dynamic categories from loaded data
const categories = computed(() => {
  const list = products.value.map(p => p.category);
  return ['All', ...new Set(list)];
});

// Filter products based on search or category circle clicked
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
    
    <div class="mb-10 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
      <h1 class="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Shop by Category</h1>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search for groceries..." 
        class="w-full md:w-80 px-4 py-2.5 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
      />
    </div>

    <div class="mb-12 flex flex-wrap justify-center sm:justify-start gap-6 md:gap-8">
      <div 
        v-for="category in categories" 
        :key="category"
        @click="selectedCategory = category"
        class="flex flex-col items-center cursor-pointer group text-center"
      >
        <div 
          :class="[
            'w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 p-1 bg-white shadow-sm transition-all duration-200 flex items-center justify-center overflow-hidden',
            selectedCategory === category 
              ? 'border-blue-600 scale-105 shadow-md ring-4 ring-blue-50' 
              : 'border-gray-200 group-hover:border-blue-400 group-hover:shadow'
          ]"
        >
          <img 
            :src="categoryImages[category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150'" 
            :alt="category"
            class="w-full h-full object-cover rounded-full"
          />
        </div>
        
        <span 
          :class="[
            'mt-3 text-sm font-semibold capitalize tracking-wide transition-colors',
            selectedCategory === category 
              ? 'text-blue-600 font-bold' 
              : 'text-gray-700 dark:text-gray-300 group-hover:text-blue-500'
          ]"
        >
          {{ category }}
        </span>
      </div>
    </div>

    <div v-if="loading" class="text-center text-xl py-10 dark:text-white font-medium">
      Loading fresh stock...
    </div>

    <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product" 
      />
    </div>

    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-16 text-lg bg-gray-50 dark:bg-gray-800 rounded-2xl">
      No items found in this section. Try searching something else!
    </div>

  </div>
</template>