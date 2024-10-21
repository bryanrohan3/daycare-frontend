<template>
  <div>
    <div class="flex-row-space gap-10">
      <p class="h-1">Bookings</p>
      <EmployeeDaycareDropdown
        v-if="isStaff"
        :userDaycares="userDaycares"
        :selectedDaycareId="selectedDaycareId"
        @update:selectedDaycareId="updateSelectedDaycareId"
      />
    </div>

    <Tabs :tabs="tabs">
      <template v-slot:default="{ currentTab }">
        <div class="mt-20" v-if="currentTab === 'bookings'">
          <DaycareBookingsList
            v-if="isStaff"
            :selectedDaycareId="selectedDaycareId"
          />
          <CustomerBookingsList v-else />
        </div>
        <div v-else-if="currentTab === 'waitlist'">
          <Waitlist :selectedDaycareId="selectedDaycareId" />
        </div>
      </template>
    </Tabs>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
import EmployeeDaycareDropdown from "@/components/EmployeeDaycareDropdown.vue";
import DaycareBookingsList from "@/components/DaycareBookingsList.vue";
import CustomerBookingsList from "@/components/CustomerBookingsList.vue";
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import { mapGetters } from "vuex";
import Waitlist from "@/components/Waitlist.vue";

export default {
  name: "DaycareBookingPage",
  components: {
    Tabs,
    EmployeeDaycareDropdown,
    DaycareBookingsList,
    CustomerBookingsList,
    Waitlist,
  },
  data() {
    return {
      userDaycares: [],
      selectedDaycareId: null,
      tabs: [
        { name: "bookings", label: "Bookings" },
        { name: "waitlist", label: "Waitlist" },
      ],
    };
  },
  computed: {
    ...mapGetters(["getUserAccountType"]),
    isStaff() {
      return this.getUserAccountType === "staff";
    },
  },
  async created() {
    if (this.isStaff) {
      const daycares = await this.fetchUserDaycares();
      this.userDaycares = daycares;

      if (this.userDaycares.length > 0) {
        this.selectedDaycareId = String(this.userDaycares[0].id);
      } else {
        this.selectedDaycareId = null;
      }
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
    updateSelectedDaycareId(newId) {
      this.selectedDaycareId = newId !== null ? String(newId) : null;
    },
  },
};
</script>

<style scoped>
@import "@/utils/flex.scss";
@import "@/utils/fonts.scss";
</style>
