<template>
  <div>
    <p>Customer</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "CustomerHomePage",
  methods: {
    handleLogout() {
      this.logout();
      this.$router.push({ name: "login" });
    },
    ...mapMutations(["logout"]),
  },
};
</script>
