<template>
  <div class="staff-layout">
    <nav class="navbar"></nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: "StaffLayout",
};
</script>

<style scoped>
.staff-layout {
  display: flex;
  height: 100vh; /* Full viewport height */
}

.navbar {
  width: 20%; /* Takes up 25% of the screen width */
  color: #fff; /* Text color for the navbar */
  background-color: #e5e5e5; /* Background color for the navbar */
  padding: 1rem; /* Padding inside the navbar */
  box-sizing: border-box; /* Include padding in width calculation */
}

.main-content {
  width: 80%; /* Takes up 75% of the screen width */
  padding: 2rem; /* Padding inside the main content area */
  box-sizing: border-box; /* Include padding in width calculation */
  background-color: #f5f5f5; /* Background color for the main content */
}
</style>
