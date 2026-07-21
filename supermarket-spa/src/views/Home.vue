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
      const titleLower = p.title?.toLowerCase() || '';
      const catLower = p.category?.toLowerCase() || '';
      
      let assignedCategory = 'Household'; 

      if (titleLower.includes('pet') || titleLower.includes('dog') || titleLower.includes('cat') || titleLower.includes('bird')) {
        assignedCategory = 'Pet Care';
      } 
      else if (titleLower.includes('chicken') || titleLower.includes('meat') || titleLower.includes('fish') || titleLower.includes('beef') || titleLower.includes('tuna') || titleLower.includes('steak')) {
        assignedCategory = 'Meats & Fish';
      } 
      else if (catLower === 'beauty' || catLower === 'fragrances' || titleLower.includes('soap') || titleLower.includes('shampoo')) {
        assignedCategory = 'Beauty & Fragrances';
      } 
      else if (titleLower.includes('bread') || titleLower.includes('croissant') || titleLower.includes('cake') || titleLower.includes('bun') || titleLower.includes('biscuit')) {
        assignedCategory = 'Bakery'; 
      } 
      else if (titleLower.includes('water') || titleLower.includes('juice') || titleLower.includes('milk') || titleLower.includes('cola') || titleLower.includes('soda') || titleLower.includes('drink') || titleLower.includes('coffee')) {
        assignedCategory = 'Beverages';
      } 
      else if (titleLower.includes('apple') || titleLower.includes('banana') || titleLower.includes('berry') || titleLower.includes('fruit') || titleLower.includes('kiwi') || titleLower.includes('lemon')) {
        assignedCategory = 'Fruits';
      } 
      else if (catLower === 'groceries' || titleLower.includes('egg') || titleLower.includes('oil') || titleLower.includes('powder') || titleLower.includes('rice') || titleLower.includes('sugar') || titleLower.includes('salt') || titleLower.includes('tomato') || titleLower.includes('potato') || titleLower.includes('onion') || titleLower.includes('garlic') || titleLower.includes('carrot') || titleLower.includes('cabbage') || titleLower.includes('veg')) {
        assignedCategory = 'Pantry & Kitchen';
      }

      return {
        ...p,
        category: assignedCategory, 
        price: Math.round((p.price || 0) * 300) 
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
});

const categories = computed(() => {
  const list = products.value.map(p => p.category);
  return ['All', ...new Set(list)];
});

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value === 'All' || p.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8 overflow-hidden">
    
    <div class="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <h1 class="text-3xl font-bold dark:text-white">Fresh Groceries</h1>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search products..." 
        class="w-full md:w-72 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all focus:shadow-lg" 
      />
    </div>

    <div class="mb-8 flex flex-wrap gap-2">
      <button 
        v-for="category in categories" 
        :key="category"
        @click="selectedCategory = category"
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md',
          selectedCategory === category 
            ? 'bg-blue-600 text-white shadow-md scale-105' 
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
        ]"
      >
        {{ category }}
      </button>
    </div>

    <!-- 🌟 NEW: SEAMLESS FULL-WIDTH SLIDING ADVERTISING BAR -->
    <div class="my-6 w-full overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl shadow-md border border-white/20 dark:border-gray-700 flex items-center">
      <div class="py-3 flex whitespace-nowrap animate-marquee">
        
        <!-- First Set of Promotions -->
        <div class="flex items-center shrink-0">
          <span class="text-white font-bold text-sm sm:text-base mx-8">
            🎉 Today's Special: Get <span class="text-yellow-300 font-black text-lg">20% OFF</span> all fresh produce! Use code <span class="bg-white/20 px-2 py-0.5 rounded font-mono mx-1">FRESH20</span> at checkout.
          </span>
          <span class="text-white font-bold text-sm sm:text-base mx-8">
            🚚 <span class="text-yellow-300 font-black">FREE Delivery</span> on all orders over Rs. 5000! 
          </span>
          <span class="text-white font-bold text-sm sm:text-base mx-8">
            🔥 Flash Sale: 50% off on selected Beauty & Fragrances today only!
          </span>
        </div>

        <!-- Second Set (Exact Duplicate to fill the gap seamlessly) -->
        <div class="flex items-center shrink-0">
          <span class="text-white font-bold text-sm sm:text-base mx-8">
            🎉 Today's Special: Get <span class="text-yellow-300 font-black text-lg">20% OFF</span> all fresh produce! Use code <span class="bg-white/20 px-2 py-0.5 rounded font-mono mx-1">FRESH20</span> at checkout.
          </span>
          <span class="text-white font-bold text-sm sm:text-base mx-8">
            🚚 <span class="text-yellow-300 font-black">FREE Delivery</span> on all orders over Rs. 5000! 
          </span>
          <span class="text-white font-bold text-sm sm:text-base mx-8">
            🔥 Flash Sale: 50% off on selected Beauty & Fragrances today only!
          </span>
        </div>

      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4 animate-pulse">
      <div class="relative w-16 h-16 flex items-center justify-center">
        <div class="absolute inset-0 border-4 border-blue-100 dark:border-gray-700 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 tracking-wide">
        Gathering Fresh Stock...
      </h3>
      <p class="text-xs text-gray-400 dark:text-gray-500">
        Please wait while we stock our store shelves
      </p>
    </div>

    <TransitionGroup 
      v-else-if="filteredProducts.length > 0" 
      name="list" 
      tag="div" 
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product" 
      />
    </TransitionGroup>

    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10 text-lg">
      No items matching your selection could be found.
    </div>

  </div>
</template>

<style scoped>
/* The starting and ending state of the cards */
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

/* The smooth easing transition */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* This makes sure cards smoothly slide around when surrounding cards are deleted/moved */
.list-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 🌟 UPDATED: Seamless Ad Bar Sliding Animations */
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 25s linear infinite; 
}

/* Pauses the sliding text if the user hovers their mouse over it */
.animate-marquee:hover {
  animation-play-state: paused;
}
</style>