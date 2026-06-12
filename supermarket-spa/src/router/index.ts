import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ProductDetail from '../views/ProductDetail.vue';
import Login from '../views/Login.vue'; // 1. Imported your new Login component

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/product/:id', component: ProductDetail },
    { path: '/login', component: Login } // 2. Registered the explicit login path!
  ]
});

export default router;