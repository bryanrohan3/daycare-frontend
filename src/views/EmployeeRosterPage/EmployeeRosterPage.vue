<template>
  <div>
    <div class="flex-row-space gap-10">
      <p class="h-1">Employee Roster</p>
      <EmployeeDaycareDropdown
        :userDaycares="userDaycares"
        :selectedDaycareId="selectedDaycareId"
        @update:selectedDaycareId="updateSelectedDaycareId"
      />
    </div>

    <div class="tabs">
      <div class="tab-buttons">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'roster' }"
          @click="activeTab = 'roster'"
        >
          Employee Roster
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'unavailability' }"
          @click="activeTab = 'unavailability'"
        >
          Unavailability
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'roster'">
      <HandleEmployeeRoster :selectedDaycareId="selectedDaycareId" />
    </div>

    <div v-else-if="activeTab === 'unavailability'">
      <EmployeeUnavailability :selectedDaycareId="selectedDaycareId" />
    </div>
  </div>
</template>

<script>
import HandleEmployeeRoster from "@/components/HandleEmployeeRoster.vue";
import EmployeeUnavailability from "@/components/EmployeeUnavailability.vue"; // Import the new component
import EmployeeDaycareDropdown from "@/components/EmployeeDaycareDropdown.vue"; // Import the new dropdown component
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "EmployeeRosterPage",
  components: {
    HandleEmployeeRoster,
    EmployeeUnavailability,
    EmployeeDaycareDropdown,
  },
  data() {
    return {
      activeTab: "roster",
      userDaycares: [],
      selectedDaycareId: null,
    };
  },
  async created() {
    try {
      const daycares = await this.fetchUserDaycares();
      this.userDaycares = daycares;

      if (this.userDaycares.length > 0) {
        this.selectedDaycareId = String(this.userDaycares[0].id);
      } else {
        this.selectedDaycareId = null;
      }
    } catch (error) {
      console.error("Error fetching user daycares:", error);
    }
  },
  watch: {
    userDaycares(newVal) {
      if (newVal.length > 0 && this.selectedDaycareId === null) {
        this.selectedDaycareId = newVal[0].id; // Set a valid daycare ID
      }
    },
  },
  methods: {
    async fetchUserDaycares() {
      try {
        const response = await axiosInstance.get(endpoints.currentStaffProfile);
        return response.data.daycares_names; // Adjust based on your API structure
      } catch (error) {
        console.error("Error fetching user daycares:", error);
        return [];
      }
    },
    updateSelectedDaycareId(newId) {
      this.selectedDaycareId = newId !== null ? String(newId) : null; // Ensure it is a string or null
    },
  },
};
</script>

<style scoped>
@import "@/utils/flex.scss";
@import "@/utils/fonts.scss";

.day-header {
  flex: 1;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
}

.day-column {
  flex: 1;
  min-width: 140px;
  margin-right: 1rem;
}

.shifts-container {
  display: flex;
  flex-direction: column;
}

.shift-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #fff;
  cursor: pointer;
}

.shift-card p {
  margin: 0;
  font-size: 12px;
}
</style>
