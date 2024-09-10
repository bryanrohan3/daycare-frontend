<template>
  <div>
    <div class="flex-row-space">
      <p class="h-1">Daycare Information Page</p>
      <div class="form-group">
        <label for="daycare-select">Select Daycare:</label>
        <select
          id="daycare-select"
          class="dropdown-edit-mode"
          v-model="selectedDaycareId"
          @change="handleDaycareChange"
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
    </div>

    <div class="tabs">
      <div class="tab-buttons">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'daycare-details' }"
          @click="activeTab = 'daycare-details'"
        >
          Daycare Details
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'products' }"
          @click="activeTab = 'products'"
        >
          Products
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'employees' }"
          @click="activeTab = 'employees'"
        >
          Employees
        </button>
      </div>

      <div v-if="activeTab === 'daycare-details'">
        <DaycareCreateEditPage
          ref="daycareCreateEditPage"
          :isEditMode="isEditMode"
          :selectedDaycareId="selectedDaycareId"
        />
      </div>
      <div v-if="activeTab === 'products'">
        <p>Products Content Goes Here</p>
      </div>
      <div v-if="activeTab === 'employees'">
        <p>Employees Content Goes Here</p>
      </div>
    </div>
  </div>
</template>

<script>
import DaycareCreateEditPage from "@/components/DaycareCreateEditPage.vue";
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "DaycareDetailPage",
  components: {
    DaycareCreateEditPage,
  },
  data() {
    return {
      activeTab: "daycare-details",
      userDaycares: [],
      selectedDaycareId: null,
    };
  },
  computed: {
    isEditMode() {
      return !!this.selectedDaycareId;
    },
  },
  async created() {
    try {
      this.userDaycares = await this.fetchUserDaycares();
      if (this.userDaycares.length > 0) {
        this.selectedDaycareId = this.userDaycares[0].id;
      }
    } catch (error) {
      console.error("Error fetching user daycares:", error);
    }
  },
  methods: {
    async fetchUserDaycares() {
      try {
        const response = await axiosInstance.get(endpoints.currentStaffProfile);
        return response.data.daycares_names;
      } catch (error) {
        console.error("Error fetching user daycares:", error);
        return [];
      }
    },
  },
};
</script>

<style scoped>
@import "@/utils/tabs.scss";
</style>
