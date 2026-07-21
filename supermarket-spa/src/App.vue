<script setup lang="ts">
import { ref, onMounted } from 'vue';

// State for the Sliding Cart Drawer
const isCartOpen = ref(false);
const cartItems = ref([]); // Placeholder for actual cart data

// Dark Mode State & Logic
const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

onMounted(() => {
  if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-gray-900 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:24px_24px] transition-colors duration-300 font-sans">
    
    <!-- GLASSMORPHISM STICKY NAV -->
    <nav class="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div class="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          
          <!-- 🌟 UPGRADED: Continuous Liquid Gradient Logo -->
          <span class="text-3xl sm:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 animate-liquid-gradient bg-[length:200%_auto] cursor-pointer hover:opacity-80 transition-opacity pb-1">
            Ruhuna Supermart
          </span>

        </div>
        <div class="flex items-center gap-4">
          <button class="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block">Sign In</button>
          
          <!-- Trigger for Sliding Cart -->
          <button @click="isCartOpen = true" class="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400 px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 border border-transparent dark:border-blue-800/50">
            🛒 Cart: {{ cartItems.length }}
          </button>

          <!-- Theme Toggle Button -->
          <button @click="toggleDarkMode" class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full font-bold text-sm transition-all border border-transparent dark:border-gray-700">
            <span v-if="!isDarkMode">🌙 Dark</span>
            <span v-else>☀️ Light</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main View Routing -->
    <router-view />

    <!-- SLIDING CART SIDE-DRAWER -->
    <div v-if="isCartOpen" class="fixed inset-0 z-[100] overflow-hidden">
      <!-- Dark backdrop -->
      <div class="absolute inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in" @click="isCartOpen = false"></div>
      
      <!-- Drawer Panel -->
      <div class="absolute inset-y-0 right-0 max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 flex flex-col animate-in slide-in-from-right border-l border-gray-200 dark:border-gray-700">
        
        <!-- Drawer Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 transition-colors">
          <h2 class="text-xl font-black text-gray-900 dark:text-white">Your Cart</h2>
          <button @click="isCartOpen = false" class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-200 dark:bg-gray-700 w-8 h-8 flex items-center justify-center rounded-full transition-colors">
            ✕
          </button>
        </div>
        
        <!-- Drawer Body -->
        <div class="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 transition-colors">
          <span class="text-5xl mb-4 opacity-50 dark:opacity-30">🛒</span>
          <p class="font-medium">Your cart is currently empty.</p>
        </div>
        
        <!-- Drawer Footer -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors">
          <button class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 dark:shadow-none transition-all transform hover:-translate-y-0.5">
            Checkout Now
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
/* 🌟 NEW: Liquid Gradient Animation */
@keyframes liquid-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-liquid-gradient {
  animation: liquid-gradient 5s ease-in-out infinite;
}
</style>