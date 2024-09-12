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
        <button
          class="tab-button"
          :class="{ active: activeTab === 'add-product' }"
          @click="activeTab = 'add-product'"
        >
          Add Product
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'add-employees' }"
          @click="activeTab = 'add-employees'"
        >
          Add Employee
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
        <DaycareProducts :selectedDaycareId="selectedDaycareId" />
      </div>
      <div v-if="activeTab === 'employees'">
        <DaycareEmployees :selectedDaycareId="selectedDaycareId" />
      </div>

      <div v-if="activeTab === 'add-product'">
        <!-- <p>Add Product</p> -->
        <AddProduct :daycareId="selectedDaycareId" />
      </div>

      <div v-if="activeTab === 'add-employees'">
        <!-- <p>Add Employee</p>
          -->
        <CreateEmployee :selectedDaycareId="selectedDaycareId" />
      </div>
    </div>
  </div>
</template>

<script>
import DaycareCreateEditPage from "@/components/DaycareCreateEditPage.vue";
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import DaycareEmployees from "@/components/DaycareEmployees.vue";
import DaycareProducts from "@/components/DaycareProducts.vue";
import AddProduct from "@/components/AddProduct.vue";
import CreateEmployee from "@/components/CreateEmployee.vue";

export default {
  name: "DaycareDetailPage",
  components: {
    DaycareCreateEditPage,
    DaycareEmployees,
    DaycareProducts,
    AddProduct,
    CreateEmployee,
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
