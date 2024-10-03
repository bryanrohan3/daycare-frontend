<template>
  <div class="layout">
    <Navbar :links="customerLinks" />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  name: "CustomerLayout",
  components: {
    Navbar,
  },
  data() {
    return {
      // Add into FormField Later
      customerLinks: [
        { name: "home", label: "Home", path: "/customer/home" },
        { name: "pets", label: "Pets", path: "/customer/pets" },
      ],
    };
  },
};
</script>

<style scoped>
@import "@/utils/navbar.scss";
</style>
