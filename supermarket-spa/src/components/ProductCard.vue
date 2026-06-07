<script setup lang="ts">
import type { Product } from '../types';
import { useCartStore } from '../store/cart';

defineProps<{
  product: Product;
}>();

const cartStore = useCartStore();

// Dynamic unit measurement helper function
const getUnit = (title: string) => {
  const name = title.toLowerCase();
  
  if (name.includes('water') || name.includes('juice') || name.includes('milk') || name.includes('cola') || name.includes('soda') || name.includes('drink') || name.includes('oil')) {
    return '/ Bottle';
  } else if (name.includes('egg')) {
    return '/ Dozen';
  } else if (name.includes('ice cream')) {
    return '/ Tub';
  } else if (name.includes('pet') || name.includes('dog') || name.includes('cat') || (name.includes('food') && name.includes('can')) || name.includes('tuna')) {
    return '/ Can';
  } else if (name.includes('biscuit') || name.includes('snack') || name.includes('chips') || name.includes('box')) {
    return '/ Pack';
  }
  
  return '/ Kg';
};
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex flex-col justify-between hover:shadow-lg hover:scale-105 transition-all duration-200">
    <router-link :to="`/product/${product.id}`" class="block bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4 flex items-center justify-center h-48 overflow-hidden">
      <img :src="product.thumbnail" :alt="product.title" class="max-h-full max-w-full object-contain" />
    </router-link>

    <div>
      <span class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
        {{ product.category }}
      </span>
      <router-link :to="`/product/${product.id}`" class="block">
        <h2 class="font-bold text-gray-800 dark:text-white line-clamp-1 hover:text-blue-600 transition-colors">
          {{ product.title }}
        </h2>
      </router-link>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 min-h-[2rem]">
        {{ product.description }}
      </p>
    </div>

    <div class="mt-4 pt-3 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
      <div class="flex items-baseline gap-0.5">
        <span class="text-lg font-black text-gray-900 dark:text-white">Rs. {{ product.price }}</span>
        <span class="text-xs font-medium text-gray-400 dark:text-gray-500">{{ getUnit(product.title) }}</span>
      </div>
      <button 
        @click="cartStore.addToCart(product)"
        class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
      >
        + Add
      </button>
    </div>
  </div>
</template>