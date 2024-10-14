import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import LoginPage from "@/views/LoginPage/LoginPage.vue";
import CustomerHomePage from "@/views/CustomerHomePage/CustomerHomePage.vue";
import StaffDashboardPage from "@/views/StaffDashboardPage/StaffDashboardPage.vue";
import CustomerSignUpPage from "@/views/CustomerSignUpPage/CustomerSignUpPage.vue";
import CreateDaycarePage from "@/views/CreateDaycarePage/CreateDaycarePage.vue";
import DaycareDetailPage from "@/views/DaycareDetailPage.vue/DaycareDetailPage.vue";
import DaycareCreateEditPage from "@/components/DaycareCreateEditPage.vue";
import EmployeeRosterPage from "@/views/EmployeeRosterPage/EmployeeRosterPage.vue";
import CustomerPetPage from "@/views/CustomerPetPage/CustomerPetPage.vue";
import PetProfilePage from "@/views/PetProfilePage/PetProfilePage.vue";
import DaycareBookingPage from "@/views/DaycareBookingPage/DaycareBookingPage.vue";
// Layouts
import StaffLayout from "@/components/layouts/StaffLayout.vue";
import CustomerLayout from "@/components/layouts/CustomerLayout.vue";

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
    meta: { requiresAuth: true, account_type: "staff" }, // Only accessible to staff
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
      {
        path: "roster",
        name: "EmployeeRosterPage",
        component: EmployeeRosterPage,
      },
      {
        path: "pets/:id/",
        name: "StaffPetProfile",
        component: PetProfilePage,
        props: true,
        meta: { requiresAuth: true, account_type: "staff" }, // Staff only
      },
      {
        path: "bookings",
        name: "StaffBookingsPage",
        component: DaycareBookingPage,
        meta: { requiresAuth: true, account_type: "staff" },
      },
    ],
  },
  {
    path: "/customer",
    component: CustomerLayout,
    meta: { requiresAuth: true, account_type: "customer" }, // Only accessible to customers
    children: [
      {
        path: "home",
        name: "CustomerHomePage",
        component: CustomerHomePage,
      },
      {
        path: "pets",
        name: "CustomerPetPage",
        component: CustomerPetPage,
      },
      {
        path: "pets/:id/",
        name: "CustomerPetProfile",
        component: PetProfilePage,
        props: true,
        meta: { requiresAuth: true, account_type: "customer" }, // Customer only
      },
      {
        path: "bookings",
        name: "CustomerBookingsPage",
        component: DaycareBookingPage,
        meta: { requiresAuth: true, account_type: "customer" },
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
  } else if (requiresAuth && to.meta.account_type) {
    // Check if the account_type is an array (for routes like PetProfilePage)
    if (Array.isArray(to.meta.account_type)) {
      if (to.meta.account_type.includes(userAccountType)) {
        next();
      } else {
        next("/login"); // Redirect if the user type isn't allowed
      }
    } else if (userAccountType !== to.meta.account_type) {
      next("/login"); // Redirect if role does not match
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
