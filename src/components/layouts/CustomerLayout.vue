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
import { customerLinks } from "@/config/formFieldConfig.js";

export default {
  name: "CustomerLayout",
  components: {
    Navbar,
  },
  data() {
    return {
      customerLinks,
    };
  },
};
</script>

<style scoped>
@import "@/utils/navbar.scss";
</style>
