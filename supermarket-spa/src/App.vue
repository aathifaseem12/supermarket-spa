<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from './store/cart';

const cartStore = useCartStore();
const isDarkMode = ref(false);

// State to control the sliding ad banner
const showPromo = ref(true);

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
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans bg-pattern relative z-0">
    
    <!-- 🌟 NEW: Big Centered Sliding Advertising Modal -->
    <transition name="slide-down">
      <div v-if="showPromo" class="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-gray-900/60 backdrop-blur-sm">
        <div class="bg-gradient-to-br from-red-500 to-rose-600 dark:from-red-800 dark:to-rose-900 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-2xl w-full text-center relative overflow-hidden border-4 border-white/20">
          
          <!-- Close Button -->
          <button 
            @click="showPromo = false" 
            class="absolute top-4 right-4 text-white/80 hover:text-white bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all"
            title="Close Ad"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <span class="text-6xl sm:text-7xl mb-6 block animate-bounce">🎉</span>
          <h2 class="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">
            Today's Special Deal!
          </h2>
          <p class="text-lg sm:text-2xl text-red-50 font-medium mb-8">
            Get <span class="font-black text-yellow-300">20% OFF</span> all fresh produce. Use code <span class="bg-white/20 px-3 py-1 rounded-md font-mono tracking-wider font-bold">FRESH20</span> at checkout.
          </p>
          
          <button 
            @click="showPromo = false" 
            class="bg-white text-red-600 hover:bg-gray-100 font-black py-4 px-10 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 text-lg sm:text-xl"
          >
            Claim Discount Now
          </button>
        </div>
      </div>
    </transition>

    <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/40 to-transparent dark:from-blue-900/10 pointer-events-none -z-10"></div>

    <nav class="bg-white/85 dark:bg-gray-800/85 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        <!-- 🌟 UPGRADED LOGO -->
        <router-link 
          to="/" 
          class="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-[length:200%_auto] animate-gradient-text hover:scale-105 transition-transform duration-300 drop-shadow-sm"
        >
          Ruhuna Supermart
        </router-link>
        
        <div class="flex items-center gap-3 sm:gap-6">
          <router-link 
            to="/login" 
            class="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Sign In
          </router-link>

          <div class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-bold text-sm shadow-sm backdrop-blur-sm">
            🛒 Cart: {{ cartStore.totalItems }}
          </div>
          
          <button 
            @click="toggleDark" 
            class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-all transform hover:scale-110 active:scale-95 shadow-sm"
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
.bg-pattern {
  background-image: radial-gradient(rgba(156, 163, 175, 0.25) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
}
.dark .bg-pattern {
  background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px);
}

/* 🌟 NEW: Ad Bar Sliding Animations */
.slide-down-enter-active {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Creates a nice bounce effect */
}
.slide-down-leave-active {
  transition: all 0.4s ease-in;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-100px) scale(0.9);
}

/* Continuous gradient shine effect */
@keyframes gradient-text {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.animate-gradient-text {
  animation: gradient-text 4s ease infinite;
}

/* Page Slide Animations */
.page-slide-leave-active {
  transition: all 0.25s ease-in;
}
.page-slide-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}

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