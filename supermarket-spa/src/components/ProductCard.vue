<script setup lang="ts">
import type { Product } from '../types';

defineProps<{
  product: Product
}>();

// This allows the card to tell Home.vue to open the Quick View Modal
defineEmits(['quick-view']);
</script>

<template>
  <div class="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 hover:-translate-y-1 overflow-hidden flex flex-col pb-16">
    
    <!-- Floating Category Badge -->
    <div class="absolute top-6 left-6 z-10 pointer-events-none">
      <span class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
        {{ product.category }}
      </span>
    </div>

    <!-- Image Container with Zoom & Quick View Overlay -->
    <div 
      class="relative h-48 w-full mb-4 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center cursor-pointer border border-transparent dark:border-gray-700/50" 
      @click="$emit('quick-view', product)"
    >
      <img 
        :src="product.thumbnail" 
        :alt="product.title" 
        class="object-contain h-full w-full p-4 transition-transform duration-500 group-hover:scale-110"
      />
      <!-- Quick View Hover Overlay -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-white text-sm font-bold py-2 px-5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border border-transparent dark:border-gray-600">
          Quick View
        </span>
      </div>
    </div>

    <!-- Product Details -->
    <div class="flex flex-col flex-1 px-1">
      <h3 
        class="font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
        @click="$emit('quick-view', product)"
      >
        {{ product.title }}
      </h3>
      <p class="text-xl font-black text-blue-600 dark:text-blue-400 mt-auto pt-2">
        Rs. {{ product.price }}
      </p>
    </div>

    <!-- Sliding Bottom Action Bar -->
    <div class="absolute bottom-0 left-0 right-0 p-4 opacity-0 transform translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-white dark:bg-gray-800">
      <button class="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold py-2.5 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white transition-colors flex items-center justify-center gap-2 shadow-md">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Add to Cart
      </button>
    </div>
    
  </div>
</template>