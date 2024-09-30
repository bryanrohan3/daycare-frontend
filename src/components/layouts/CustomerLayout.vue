<template>
  <div class="layout">
    <nav class="navbar"></nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: "CustomerLayout",
};
</script>

<style scoped>
@import "@/utils/navbar.scss";
</style>
