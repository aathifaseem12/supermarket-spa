<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Product } from '../types';
import { useCartStore } from '../store/cart';

const route = useRoute();
const cartStore = useCartStore();
const product = ref<Product | null>(null);
const loading = ref(true);
const getUnit = (title: string) => {
  const name = title.toLowerCase();
  if (name.includes('water') || name.includes('juice') || name.includes('milk') || name.includes('Drinks') || name.includes('Ice Cream') || name.includes('Cooking Oil')) {
    return 'Liter';
  } else if (name.includes('egg')) {
    return 'Dozen';
  }
  return 'Kg';
};

onMounted(async () => {
  try {
    // Fetches the specific product using the ID from the URL
    const res = await fetch(`https://dummyjson.com/products/${route.params.id}`);
    product.value = await res.json();
    // Multiply this single item's price by 200
    fetchedProduct.price = Math.round(fetchedProduct.price * 200);
    product.value = fetchedProduct;

  } catch (error) {
    console.error("Error fetching product details:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading" class="text-center py-10 dark:text-white text-xl">Loading details...</div>
  
  <div v-else-if="product" class="max-w-4xl mx-auto px-4 py-8">
    <router-link to="/" class="text-blue-500 hover:text-blue-700 font-medium mb-6 inline-block">&larr; Back to Store</router-link>
    
    <div class="flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <img :src="product.thumbnail" :alt="product.title" class="w-full md:w-1/2 rounded-lg shadow-sm bg-gray-50 object-cover" />
      <span class="text-xl font-medium text-gray-500 dark:text-gray-400">{{ getUnit(product.title) }}</span>
      
      <div class="flex-1">
        <span class="uppercase tracking-wider text-sm text-gray-500 dark:text-gray-400">{{ product.category }}</span>
        <h1 class="text-4xl font-bold mt-2 mb-4 text-gray-900 dark:text-white">{{ product.title }}</h1>
        <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{{ product.description }}</p>
        
        <div class="mb-6">
          <span class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">Rs.{{ product.price }}</span>
        </div>
        
        <button 
          @click="cartStore.addToCart(product)" 
          class="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-bold shadow-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>