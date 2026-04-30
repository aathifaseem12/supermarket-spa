<script setup lang="ts">
import type { Product } from '../types';
import { useCartStore } from '../store/cart';

defineProps<{ product: Product }>();
const cartStore = useCartStore();
// Smart function to determine the correct unit
const getUnit = (title: string) => {
  const name = title.toLowerCase();
  if (name.includes('water') || name.includes('juice') || name.includes('milk') || name.includes('Soft Drinks') || name.includes('Ice Cream') || name.includes('Cooking Oil')) {
    return 'Liter';
  } else if (name.includes('egg')) {
    return 'Dozen';
  }
  return 'Kg';
};
</script>

<template>
  <div class="border rounded-lg p-4 shadow-sm hover:shadow-md transition dark:bg-gray-800 dark:border-gray-700">
    <img :src="product.thumbnail" :alt="product.title" class="w-full h-40 object-cover rounded-md mb-3 bg-white" />
    <h2 class="text-lg font-bold text-gray-900 dark:text-white truncate">{{ product.title }}</h2>
    <div class="mt-4 flex flex-col gap-2">
      <span class="text-xl font-extrabold text-blue-600 dark:text-blue-400">Rs.{{ product.price }}</span>
      <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ getUnit(product.title) }}</span>
      <div class="flex gap-2">
        <router-link :to="'/product/' + product.id" class="flex-1 text-center bg-gray-200 dark:bg-gray-700 dark:text-white py-1.5 rounded-md hover:bg-gray-300 transition font-medium">
          View Details
        </router-link>
        <button @click="cartStore.addToCart(product)" class="flex-1 bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700 transition font-medium">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>