<template>
  <p class="h-1">Employee Roster</p>
  <div class="flex-row-space">
    <DateSelector @apply="" />
    <button @click="addShift" class="button button--tertiary mt-5 pad-5">
      Add Shift
    </button>
  </div>
</template>

<script>
import DateSelector from "@/components/DateSelector.vue";

export default {
  name: "EmployeeRosterPage",
  components: {
    DateSelector,
  },
  methods: {
    addShift() {
      // Implement the logic to handle adding a shift
      console.log("Add Shift button clicked");
    },
  },
};
</script>
