<template>
  <p>Employee Roster</p>
  <DateSelector @apply="" />
</template>

<script>
import DateSelector from "@/components/DateSelector.vue";

export default {
  name: "EmployeeRosterPage",
  components: {
    DateSelector,
  },
};
</script>
