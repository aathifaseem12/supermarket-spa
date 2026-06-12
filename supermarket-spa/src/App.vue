<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from './store/cart';

const cartStore = useCartStore();
const isDarkMode = ref(false);

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
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
    
    <nav class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <router-link to="/" class="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
          Ruhuna Supermart
        </router-link>
        
        <div class="flex items-center gap-3 sm:gap-6">
          <router-link 
            to="/login" 
            class="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Sign In
          </router-link>

          <div class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-bold text-sm shadow-sm">
            🛒 Cart: {{ cartStore.totalItems }}
          </div>
          
          <button 
            @click="toggleDark" 
            class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-all transform hover:scale-110 active:scale-95"
            title="Toggle Dark Mode"
          >
            {{ isDarkMode ? '☀️ Light' : '🌙 Dark' }}
          </button>
        </div>
      </div>
    </nav>

    <main class="overflow-hidden">
      <router-view v-slot="{ Component }">
        <transition name="page-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

  </div>
</template>

<style>
/* Fades out the old page and slides it slightly to the left */
.page-slide-leave-active {
  transition: all 0.25s ease-in;
}
.page-slide-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}

/* Fades in the new page and slides it in from the right */
.page-slide-enter-active {
  transition: all 0.35s ease-out;
}
.page-slide-enter-from {
  opacity: 0;
  transform: translateX(15px);
}
.page-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}
</style>