<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Product, ProductResponse } from '../types';
import ProductCard from '../components/ProductCard.vue';

const products = ref<Product[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('All');
const loading = ref(true);

// State for the Quick View Modal
const selectedProduct = ref<Product | null>(null);

// 🌟 NEW: Track selected quantity
const selectedQuantity = ref(1); 

const openQuickView = (product: Product) => {
  selectedProduct.value = product;
  selectedQuantity.value = 1; // Reset quantity back to 1 every time a new product is opened
};

const closeQuickView = () => {
  selectedProduct.value = null;
};

// 🌟 NEW: Quantity Control Functions
const decreaseQuantity = () => {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value--;
  }
};

const increaseQuantity = () => {
  // Prevent user from selecting more than what is in stock
  if (selectedProduct.value && selectedQuantity.value < selectedProduct.value.stock) {
    selectedQuantity.value++;
  }
};

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
  <div class="max-w-[1280px] mx-auto px-6 py-10 overflow-hidden font-sans relative">
    
    <div class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 class="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2 transition-colors">Explore Groceries</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm transition-colors">Browse, filter, and discover fresh products.</p>
      </div>
      
      <div class="relative w-full md:w-80">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search products..." 
          class="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-900 dark:border-gray-700 dark:focus:border-blue-500 dark:focus:ring-blue-900" 
        />
      </div>
    </div>

    <div class="mb-10 flex flex-wrap gap-2.5">
      <button 
        v-for="category in categories" 
        :key="category"
        @click="selectedCategory = category"
        :class="[
          'px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 border',
          selectedCategory === category 
            ? 'bg-gray-900 border-gray-900 text-white dark:bg-gray-100 dark:border-gray-100 dark:text-gray-900 shadow-md' 
            : 'bg-transparent border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600'
        ]"
      >
        {{ category }}
      </button>
    </div>

    <!-- Ad Bar -->
    <div class="my-10 w-full overflow-hidden bg-gray-50 rounded-2xl border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 flex items-center transition-colors">
      <div class="py-4 flex whitespace-nowrap animate-marquee">
        <div class="flex items-center shrink-0">
          <span class="text-gray-700 dark:text-gray-300 font-bold text-sm mx-10">
            🎉 Today's Special: Get <span class="text-blue-600 dark:text-blue-400 font-black">20% OFF</span> all fresh produce! Use code <span class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded font-mono mx-1 text-xs text-gray-900 dark:text-white">FRESH20</span>
          </span>
          <span class="text-gray-700 dark:text-gray-300 font-bold text-sm mx-10">
            🚚 <span class="text-blue-600 dark:text-blue-400 font-black">FREE Delivery</span> on all orders over Rs. 5000! 
          </span>
          <span class="text-gray-700 dark:text-gray-300 font-bold text-sm mx-10">
            🔥 Flash Sale: 50% off selected items today only!
          </span>
        </div>
        <div class="flex items-center shrink-0">
          <span class="text-gray-700 dark:text-gray-300 font-bold text-sm mx-10">
            🎉 Today's Special: Get <span class="text-blue-600 dark:text-blue-400 font-black">20% OFF</span> all fresh produce! Use code <span class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded font-mono mx-1 text-xs text-gray-900 dark:text-white">FRESH20</span>
          </span>
          <span class="text-gray-700 dark:text-gray-300 font-bold text-sm mx-10">
            🚚 <span class="text-blue-600 dark:text-blue-400 font-black">FREE Delivery</span> on all orders over Rs. 5000! 
          </span>
          <span class="text-gray-700 dark:text-gray-300 font-bold text-sm mx-10">
            🔥 Flash Sale: 50% off selected items today only!
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-6">
      <div class="relative w-12 h-12 flex items-center justify-center">
        <div class="absolute inset-0 border-2 border-gray-100 dark:border-gray-800 rounded-full"></div>
        <div class="absolute inset-0 border-2 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide">
        Gathering Fresh Stock...
      </p>
    </div>

    <!-- Product Grid -->
    <TransitionGroup 
      v-else-if="filteredProducts.length > 0" 
      name="list" 
      tag="div" 
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8"
    >
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product"
        @quick-view="openQuickView" 
      />
    </TransitionGroup>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <svg class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or category filter.</p>
    </div>

    <!-- 🌟 QUICK VIEW MODAL (Now with Quantity Selector) -->
    <div v-if="selectedProduct" class="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div class="absolute inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in" @click="closeQuickView"></div>
      
      <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-200 border border-transparent dark:border-gray-700">
        
        <button @click="closeQuickView" class="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white shadow-sm transition-colors border border-gray-200 dark:border-gray-600">
          ✕
        </button>
        
        <div class="md:w-1/2 bg-gray-50 dark:bg-gray-900/50 p-12 flex items-center justify-center border-r border-transparent dark:border-gray-700">
          <img :src="selectedProduct.thumbnail" :alt="selectedProduct.title" class="max-h-80 w-full object-contain drop-shadow-xl dark:drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]" />
        </div>
        
        <div class="md:w-1/2 p-8 md:p-10 overflow-y-auto flex flex-col">
          <span class="text-xs font-black text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-3 block">{{ selectedProduct.category }}</span>
          <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{{ selectedProduct.title }}</h2>
          
          <div class="flex items-center gap-3 mb-6">
            <span class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1 border border-transparent dark:border-yellow-800/50">
              ⭐ {{ selectedProduct.rating }}
            </span>
            <span class="text-sm font-bold px-2.5 py-1 rounded border border-transparent" :class="selectedProduct.stock > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50'">
              {{ selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock})` : 'Out of Stock' }}
            </span>
          </div>
          
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{{ selectedProduct.description }}</p>
          
          <div class="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm text-gray-500 dark:text-gray-400 line-through" v-if="selectedProduct.discountPercentage">
                Rs. {{ Math.round(selectedProduct.price * (100 / (100 - selectedProduct.discountPercentage))) }}
              </span>
              <span class="text-3xl font-black text-gray-900 dark:text-white">Rs. {{ selectedProduct.price }}</span>
            </div>
            
            <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              
              <!-- 🌟 NEW: Quantity Selector Component -->
              <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1 w-full sm:w-auto justify-between">
                <button 
                  @click="decreaseQuantity" 
                  class="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-lg shadow-sm transition-all font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed" 
                  :disabled="selectedQuantity <= 1"
                >
                  -
                </button>
                <span class="w-10 text-center font-bold text-gray-900 dark:text-white">{{ selectedQuantity }}</span>
                <button 
                  @click="increaseQuantity" 
                  class="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-lg shadow-sm transition-all font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed" 
                  :disabled="selectedProduct && selectedQuantity >= selectedProduct.stock"
                >
                  +
                </button>
              </div>

              <!-- Add to Cart Button -->
              <button class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/30 dark:shadow-none transition-transform transform hover:-translate-y-1">
                Add to Cart
              </button>
              
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 35s linear infinite; 
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>