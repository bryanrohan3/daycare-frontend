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

export default {
  name: "StaffLayout",
  components: {
    Navbar,
  },
  data() {
    return {
      // Add into FormField Later
      staffLinks: [
        { name: "dashboard", label: "Dashboard", path: "/staff/dashboard" },
        {
          name: "create-daycare",
          label: "Create Daycare",
          path: "/staff/create-daycare",
        },
        { name: "roster", label: "Employee Roster", path: "/staff/roster" },
        { name: "daycares", label: "Daycare", path: "/staff/daycare" },
      ],
    };
  },
};
</script>

<style scoped>
@import "@/utils/navbar.scss";
</style>
