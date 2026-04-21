<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from './store/cart';

const cartStore = useCartStore();
const isDarkMode = ref(false);

// Mandatory Bonus Feature: Dark Mode Toggle
const toggleDark = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 font-sans">
    
    <nav class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <router-link to="/" class="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
          Ruhuna Supermart
        </router-link>
        
        <div class="flex items-center gap-4 sm:gap-6">
          <div class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-bold text-sm">
            🛒 Cart: {{ cartStore.totalItems }}
          </div>
          
          <button 
            @click="toggleDark" 
            class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition"
            title="Toggle Dark Mode"
          >
            {{ isDarkMode ? '☀️ Light' : '🌙 Dark' }}
          </button>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>

  </div>
</template>