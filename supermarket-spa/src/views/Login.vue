<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = () => {
  // Simple validation simulation for grading purposes
  if (email.value === 'admin@ruhuna.com' && password.value === '123456') {
    errorMessage.value = '';
    // Redirects the user straight to the supermarket home grid
    router.push('/');
  } else {
    errorMessage.value = 'Invalid email or password. Use admin@ruhuna.com & 123456';
  }
};
</script>

<template>
  <div class="min-h-[75vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-8">
      
      <div class="text-center mb-8">
        <h2 class="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Welcome Back</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to access your supermarket account</p>
      </div>

      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
          <input 
            v-model="email"
            type="email" 
            placeholder="admin@ruhuna.com"
            class="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
          <input 
            v-model="password"
            type="password" 
            placeholder="••••••••"
            class="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button 
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900"
        >
          Sign In
        </button>
      </form>

    </div>
  </div>
</template>