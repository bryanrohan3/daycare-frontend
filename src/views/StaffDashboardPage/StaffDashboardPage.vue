<template>
  <div>
    <p>Staff</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "StaffDashboardPage",
  methods: {
    handleLogout() {
      this.logout();
      this.$router.push({ name: "login" });
    },
    ...mapMutations(["logout"]),
  },
};
</script>
