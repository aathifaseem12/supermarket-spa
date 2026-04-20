import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product, CartItem } from '../types';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  const addToCart = (product: Product) => {
    const existing = items.value.find(item => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
  };

  const totalItems = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0));

  return { items, addToCart, totalItems };
});