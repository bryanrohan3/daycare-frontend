<template>
  <div v-if="employees.length">
    <table class="table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.user.id">
          <td>{{ employee.user.first_name }}</td>
          <td>{{ employee.user.last_name }}</td>
          <td>{{ employee.user.email }}</td>
          <td>{{ employee.phone }}</td>
          <td>{{ getRoleLabel(employee.role) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    <p>No employees found for the selected daycare.</p>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "DaycareEmployees",
  props: {
    selectedDaycareId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      employees: [],
    };
  },
  watch: {
    selectedDaycareId: "fetchDaycareDetails",
  },
  methods: {
    async fetchDaycareDetails() {
      if (this.selectedDaycareId) {
        try {
          const response = await axiosInstance.get(
            `${endpoints.daycare}/${this.selectedDaycareId}`
          );
          this.employees = response.data.staff;
        } catch (error) {
          console.error("Error fetching daycare details:", error);
          this.employees = [];
        }
      }
    },
    getRoleLabel(role) {
      if (role === "E") {
        return "Employee";
      } else if (role === "O") {
        return "Owner";
      } else {
        return "Unknown"; // Fallback for unknown roles
      }
    },
  },
  created() {
    this.fetchDaycareDetails();
  },
};
</script>

<style scoped>
@import "@/utils/table.scss";
</style>
