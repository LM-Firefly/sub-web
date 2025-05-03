import { createRouter, createWebHistory } from 'vue-router';

// 定义路由配置
const routes = [
  {
    path: "*",
    name: "SubConverter",
    component: () => import("../views/Subconverter.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),  // 或 createWebHashHistory() 根据需要选择
  routes
});

export default router;
