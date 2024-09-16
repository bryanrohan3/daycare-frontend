<template>
  <div class="filters-container">
    <!-- Date Range Filter -->
    <div class="flex align-center gap-10">
      <div class="form-row">
        <div class="form-group horizontal-label">
          <label class="mt-10" for="start-date">Start Date</label>
          <input type="date" id="start-date" v-model="localStartDate" />
        </div>

        <div class="form-group horizontal-label">
          <label class="mt-10" for="end-date">End Date</label>
          <input type="date" id="end-date" v-model="localEndDate" />
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
    endDate: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      localStartDate: this.startDate,
      localEndDate: this.endDate,
    };
  },
  watch: {
    startDate(newVal) {
      this.localStartDate = newVal;
    },
    endDate(newVal) {
      this.localEndDate = newVal;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "@/utils/gap.scss";
@import "@/utils/flex.scss";
</style>
