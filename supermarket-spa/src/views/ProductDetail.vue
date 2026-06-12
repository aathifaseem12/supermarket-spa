<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Product } from '../types';
import { useCartStore } from '../store/cart';

const route = useRoute();
const cartStore = useCartStore();
const product = ref<Product | null>(null);
const loading = ref(true);

const getUnit = (productData: Product | null) => {
  if (!productData) return '';
  const name = productData.title.toLowerCase();
  const category = productData.category;
  
  if (name.includes('water') || name.includes('juice') || name.includes('milk') || name.includes('cola') || name.includes('soda') || name.includes('drink') || name.includes('oil')) return '/ Bottle';
  if (name.includes('egg')) return '/ Dozen';
  if (name.includes('ice cream')) return '/ Tub';
  if (name.includes('pet') || name.includes('can') || name.includes('tuna')) return '/ Can';
  if (name.includes('biscuit') || name.includes('snack') || name.includes('box')) return '/ Pack';
  // Note: I removed Pantry & Kitchen from here so that veggies and rice properly show as "/ Kg"
  if (category === 'Household' || category === 'Beauty & Fragrances') return '/ unit';
  return '/ Kg';
};

onMounted(async () => {
  try {
    const res = await fetch(`https://dummyjson.com/products/${route.params.id}`);
    const fetchedProduct = await res.json();
    
    fetchedProduct.price = Math.round((fetchedProduct.price || 0) * 300);
    
    const titleLower = fetchedProduct.title?.toLowerCase() || '';
    const catLower = fetchedProduct.category?.toLowerCase() || '';
    
    let assignedCategory = 'Household';

    // 🌟 SAME STRICT ORDER OF OPERATIONS 🌟
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
    
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[50vh] gap-4 animate-pulse">
      <div class="relative w-16 h-16 flex items-center justify-center">
        <div class="absolute inset-0 border-4 border-blue-100 dark:border-gray-700 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 tracking-wide">
        Inspecting Item Details...
      </h3>
    </div>

    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      
      <div class="flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
        <img :src="product.thumbnail" :alt="product.title" class="max-h-96 object-contain rounded-lg" />
      </div>

      <div class="flex flex-col justify-center">
        <span class="text-xs uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400 mb-2">
          {{ product.category }}
        </span>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-4">{{ product.title }}</h1>
        
        <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{{ product.description }}</p>
        
        <div class="flex items-baseline gap-2 mb-8">
          <span class="text-4xl font-black text-gray-900 dark:text-white">Rs. {{ product.price }}</span>
          <span class="text-xl font-medium text-gray-400 dark:text-gray-500">{{ getUnit(product) }}</span>
        </div>

        <button 
          @click="cartStore.addToCart(product)" 
          class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900"
        >
          Add to Shopping Cart
        </button>
      </div>
    </div>

    <div v-else class="text-center text-red-500 py-12">
      Product details could not be found.
    </div>

  </div>
</template>