<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { Product, ProductResponse } from '../types';
import ProductCard from '../components/ProductCard.vue';

const products = ref<Product[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('All');
const loading = ref(true);

// --- 🌟 Dynamic Offers & Ads Banner State ---
const currentAdIndex = ref(0);
let adTimer: ReturnType<typeof setInterval>;

const groceryAds = ref([
  {
    id: 1,
    title: "Avurudu Special Deals! 🌸",
    description: "Get up to 25% off on all cooking essentials and dairy items.",
    badge: "Limited Time",
    bgClass: "bg-gradient-to-r from-red-500 to-orange-500"
  },
  {
    id: 2,
    title: "Fresh Bakery Morning Combo ☕",
    description: "Buy any 2 croissants or sweet buns and get a milk packet absolutely free!",
    badge: "BOGOF",
    bgClass: "bg-gradient-to-r from-amber-500 to-yellow-600"
  },
  {
    id: 3,
    title: "Weekend Hydration Boost 💧",
    description: "Save big! Flat Rs. 150 off when you buy a case of natural spring water bottles.",
    badge: "Super Saver",
    bgClass: "bg-gradient-to-r from-blue-500 to-cyan-600"
  }
]);

onMounted(() => {
  // Rotates the advertisement banner every 4 seconds automatically
  adTimer = setInterval(() => {
    currentAdIndex.value = (currentAdIndex.value + 1) % groceryAds.value.length;
  }, 4000);
});

onUnmounted(() => {
  clearInterval(adTimer); // Cleans up background process when navigating away
});
// --------------------------------------------

const customCategories = ['All', 'Bakery', 'Drinks', 'Meats', 'Fruits', 'Beauty', 'Fragrances', 'Household'];

const categoryImages: Record<string, string> = {
  'All': 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png',
  'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=60',
  'Drinks': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&auto=format&fit=crop&q=60',
  'Meats': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=150&auto=format&fit=crop&q=60',
  'Fruits': 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=150&auto=format&fit=crop&q=60',
  'Beauty': 'https://cdn-icons-png.flaticon.com/512/1940/1940922.png',
  'Fragrances': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&auto=format&fit=crop&q=60',
  'Household': 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=150&auto=format&fit=crop&q=60'
};

onMounted(async () => {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=50');
    const data: ProductResponse = await res.json();
    
    products.value = data.products.map(p => {
      const titleLower = p.title.toLowerCase();
      let assignedCategory = 'Household'; 

      if (titleLower.includes('bread') || titleLower.includes('croissant') || titleLower.includes('cake') || titleLower.includes('powder')) {
        assignedCategory = 'Bakery';
      } else if (titleLower.includes('water') || titleLower.includes('juice') || titleLower.includes('milk') || titleLower.includes('cola') || titleLower.includes('soda')) {
        assignedCategory = 'Drinks';
      } else if (titleLower.includes('chicken') || titleLower.includes('meat') || titleLower.includes('fish') || titleLower.includes('beef')) {
        assignedCategory = 'Meats';
      } else if (titleLower.includes('apple') || titleLower.includes('banana') || titleLower.includes('berry') || titleLower.includes('fruit')) {
        assignedCategory = 'Fruits';
      } else if (p.category === 'beauty') {
        assignedCategory = 'Beauty';
      } else if (p.category === 'fragrances') {
        assignedCategory = 'Fragrances';
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
    
    <div class="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
      <h1 class="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Ruhuna Supermart</h1>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search for groceries..." 
        class="w-full md:w-80 px-4 py-2.5 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
      />
    </div>

    <div class="mb-10 overflow-hidden rounded-2xl shadow-sm text-white relative">
      <div 
        :class="[groceryAds[currentAdIndex].bgClass, 'p-6 sm:p-8 min-h-[140px] flex flex-col justify-center transition-all duration-500 relative']"
      >
        <span class="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
          {{ groceryAds[currentAdIndex].badge }}
        </span>
        
        <h2 class="text-2xl sm:text-3xl font-black mb-1.5 drop-shadow-sm">
          {{ groceryAds[currentAdIndex].title }}
        </h2>
        <p class="text-white/90 text-sm sm:text-base max-w-2xl font-medium drop-shadow-xs">
          {{ groceryAds[currentAdIndex].description }}
        </p>

        <div class="absolute bottom-4 right-4 flex gap-1.5">
          <div 
            v-for="(ad, index) in groceryAds" 
            :key="ad.id"
            :class="['w-2 h-2 rounded-full transition-all', currentAdIndex === index ? 'bg-white scale-125' : 'bg-white/40']"
          ></div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h3 class="text-xl font-bold text-gray-800 dark:text-white">Shop by Department</h3>
    </div>

    <div class="mb-12 flex flex-wrap justify-center sm:justify-start gap-6 md:gap-8">
      <div 
        v-for="category in customCategories" 
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
            :src="categoryImages[category]" 
            :alt="category"
            class="w-full h-full object-cover rounded-full"
          />
        </div>
        
        <span 
          :class="[
            'mt-3 text-sm font-semibold tracking-wide transition-colors',
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