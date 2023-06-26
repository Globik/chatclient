import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ReportView from "../components/TheReport.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/report",
      name: "report",
      component: ReportView,
    },
    {
      path: "/yandex",
      name: "yandex",
      component: () => import("../views/YandexView.vue"),
    },
    {
      path: "/google",
      name: "google",
      component: () => import("../views/GoogleView.vue"),
    },
    {
      path: "/vk",
      name: "vkontakte",
      component: () => import('../views/VkView.vue')
    },
    {
      path: "/loading",
      name: "loading",
      component: () => import("../views/LoadingView.vue"),
    },
    
     {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/admin",
      name: "homedashboard",
      component: () => import("../views/HomeViewDashboard.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("../views/UsersView.vue"),
    },
    {
      path: "/users/:id",
      name: "user",
      component: () => import("../views/UserView.vue"),
    },
     {
      path: "/reports",
      name: "reports",
      component: () => import("../views/ReportsView.vue"),
    },
    {
      path: "/chats",
      name: "chats",
      component: () => import("../views/chats.vue"),
    },
  ],
});

export default router;
