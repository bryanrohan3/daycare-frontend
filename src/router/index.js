import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import LoginPage from "@/views/LoginPage/LoginPage.vue";
import CustomerHomePage from "@/views/CustomerHomePage/CustomerHomePage.vue";
import StaffDashboardPage from "@/views/StaffDashboardPage/StaffDashboardPage.vue";
import CustomerSignUpPage from "@/views/CustomerSignUpPage/CustomerSignUpPage.vue";
import CreateDaycarePage from "@/views/CreateDaycarePage/CreateDaycarePage.vue";
import DaycareDetailPage from "@/views/DaycareDetailPage.vue/DaycareDetailPage.vue";
import DaycareCreateEditPage from "@/components/DaycareCreateEditPage.vue";
// Layouts
import StaffLayout from "@/components/layouts/StaffLayout.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },

  {
    path: "/signup",
    name: "signup",
    component: CustomerSignUpPage,
  },

  {
    path: "/staff",
    component: StaffLayout,
    meta: { requiresAuth: true, account_type: "staff" },
    children: [
      {
        path: "dashboard",
        name: "StaffDashboardPage",
        component: StaffDashboardPage,
      },
      {
        path: "create-daycare",
        name: "CreateDaycarePage",
        component: DaycareCreateEditPage,
      },
      {
        path: "edit-daycare",
        name: "EditDaycarePage",
        component: CreateDaycarePage,
      },
      {
        path: "daycare",
        name: "DaycareDetailPage",
        component: DaycareDetailPage,
      },
    ],
  },
  {
    path: "/customer",
    meta: { requiresAuth: true, account_type: "customer" },
    children: [
      {
        path: "home",
        name: "CustomerHomePage",
        component: CustomerHomePage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const userAccountType = store.getters.getUserAccountType;

  if (requiresAuth && !store.getters.getAuthToken) {
    next("/login");
  } else if (requiresAuth && userAccountType !== to.meta.account_type) {
    next("/login"); // Redirect to login if role does not match
  } else {
    next();
  }
});

export default router;
