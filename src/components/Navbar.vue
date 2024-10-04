<template>
  <nav class="navbar fs-12 pl-30">
    <ul class="mt-30">
      <li class="mt-20" v-for="link in links" :key="link.name">
        <router-link :to="link.path" active-class="active-link bold">
          {{ link.label }}
        </router-link>
      </li>
    </ul>
  </nav>
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
};
</script>
