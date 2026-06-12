<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Product } from '../types';
import { useCartStore } from '../store/cart';

const route = useRoute();
const cartStore = useCartStore();
const product = ref<Product | null>(null);
const loading = ref(true);

// 1. IMPROVED: Safer unit helper that handles missing data
const getUnit = (productData: Product | null) => {
  if (!productData) return '';
  const name = productData.title.toLowerCase();
  const category = productData.category;
  
  if (name.includes('water') || name.includes('juice') || name.includes('milk') || name.includes('cola') || name.includes('soda')) return '/ Bottle';
  if (name.includes('egg')) return '/ Dozen';
  if (name.includes('ice cream')) return '/ Tub';
  if (name.includes('pet') || name.includes('can') || name.includes('tuna')) return '/ Can';
  if (name.includes('biscuit') || name.includes('snack') || name.includes('box')) return '/ Pack';
  if (category === 'Household' || category === 'Beauty' || category === 'Fragrances') return '/ unit';
  return '/ Kg';
};

onMounted(async () => {
  try {
    const res = await fetch(`https://dummyjson.com/products/${route.params.id}`);
    const fetchedProduct = await res.json();
    
    fetchedProduct.price = Math.round(fetchedProduct.price * 300);
    
    // Categorization logic
    const titleLower = fetchedProduct.title.toLowerCase();
    let assignedCategory = 'Household';

    if (titleLower.includes('bread') || titleLower.includes('cake')) assignedCategory = 'Bakery';
    else if (titleLower.includes('water') || titleLower.includes('milk')) assignedCategory = 'Drinks';
    else if (titleLower.includes('chicken') || titleLower.includes('meat')) assignedCategory = 'Meats';
    else if (titleLower.includes('apple') || titleLower.includes('banana')) assignedCategory = 'Fruits';
    else if (fetchedProduct.category === 'beauty') assignedCategory = 'Beauty';
    else if (fetchedProduct.category === 'fragrances') assignedCategory = 'Fragrances';

    fetchedProduct.category = assignedCategory;
    product.value = fetchedProduct;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <div v-if="loading" class="text-center text-xl dark:text-white">Loading...</div>

    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100">
      
      <div class="flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
        <img :src="product.thumbnail" :alt="product.title" class="max-h-96 object-contain" />
      </div>

      <div class="flex flex-col justify-center">
        <span class="text-xs uppercase font-bold text-blue-600 mb-2">{{ product.category }}</span>
        <h1 class="text-3xl font-black mb-4">{{ product.title }}</h1>
        
        <div class="flex items-baseline gap-2 mb-8">
          <span class="text-4xl font-black">Rs. {{ product.price }}</span>
          <span class="text-xl font-medium text-gray-400">{{ getUnit(product) }}</span>
        </div>

        <button @click="cartStore.addToCart(product)" class="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl">
          Add to Shopping Cart
        </button>
      </div>
    </div>
  </div>
</template>s