<template>
  <div class="tabs">
    <div class="tab-buttons">
      <button
        class="tab-button"
        v-for="tab in tabs"
        :key="tab.name"
        :class="{ active: currentTab === tab.name }"
        @click="currentTab = tab.name"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <slot :current-tab="currentTab" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentTab: this.tabs[0].name,
    };
  },
};
</script>
