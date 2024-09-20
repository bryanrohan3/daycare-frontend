<template>
  <div class="filters-container">
    <!-- Date Range Filter -->
    <div class="flex align-center gap-10">
      <div class="form-row">
        <div class="form-group horizontal-label">
          <label class="mt-10" for="start-date">Date</label>
          <input type="date" id="start-date" v-model="localStartDate" />
        </div>
      </div>

      <button @click="" class="button button--tertiary">Apply</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    startDate: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      localStartDate: this.startDate,
    };
  },
  watch: {
    startDate(newVal) {
      this.localStartDate = newVal;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "@/utils/gap.scss";
@import "@/utils/flex.scss";
</style>
