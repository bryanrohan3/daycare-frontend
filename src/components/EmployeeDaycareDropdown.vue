<template>
  <div class="form-group">
    <label for="daycare-select">Select Daycare:</label>
    <select
      id="daycare-select"
      class="dropdown-edit-mode"
      :value="selectedDaycareId"
      @change="onDaycareChange"
    >
      <option
        v-for="daycare in userDaycares"
        :key="daycare.id"
        :value="daycare.id"
      >
        {{ daycare.daycare_name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "EmployeeDaycareDropdown",
  props: {
    userDaycares: {
      type: Array,
      required: true,
    },
    selectedDaycareId: {
      type: [String, null],
      required: false,
      default: null,
    },
  },
  methods: {
    onDaycareChange(event) {
      const newValue = event.target.value;
      this.$emit("update:selectedDaycareId", String(newValue));
    },
  },
};
</script>
