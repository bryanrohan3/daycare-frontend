<template>
  <div class="layout">
    <Navbar :links="staffLinks" />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { staffLinks } from "@/config/formFieldConfig.js";

export default {
  name: "StaffLayout",
  components: {
    Navbar,
  },
  data() {
    return {
      staffLinks,
    };
  },
};
</script>

<style scoped>
@import "@/utils/navbar.scss";
</style>
