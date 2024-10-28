<template>
  <div>
    <div class="hamburger" @click="toggleNavbar">
      <div></div>
      <div></div>
      <div></div>
    </div>

    <nav :class="['navbar', { active: isNavbarActive }, 'fs-12', 'pl-30']">
      <ul class="mt-30">
        <li class="mt-20" v-for="link in links" :key="link.name">
          <router-link :to="link.path" active-class="active-link bold">
            {{ link.label }}
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  props: {
    links: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isNavbarActive: false,
    };
  },
  methods: {
    toggleNavbar() {
      this.isNavbarActive = !this.isNavbarActive;
    },
  },
};
</script>
