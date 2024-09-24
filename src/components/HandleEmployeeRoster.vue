<template>
  <div>
    <div class="flex-row-space">
      <DateSelector @apply="updateWeekFromDate" />
      <button
        v-if="userRole === 'O'"
        @click="showModal"
        class="button button--tertiary mt-5 pad-5"
      >
        Add Shift
      </button>
    </div>

    <div class="flex-row-space mb-20 mt-20">
      <button @click="changeWeek(-1)" class="button button--tertiary">
        ← Last Week
      </button>
      <button @click="changeWeek(1)" class="button button--tertiary">
        Next Week →
      </button>
    </div>

    <div class="flex-row-space mb-20">
      <div v-for="(date, index) in weekDates" :key="index" class="day-header">
        {{ date.day }}<br />{{ date.date }}
      </div>
    </div>

    <div class="flex-row-space">
      <div v-for="(date, index) in weekDates" :key="index" class="day-column">
        <div class="shifts-container">
          <div v-if="groupedShifts[date.fullDate]?.length">
            <div
              v-for="shift in groupedShifts[date.fullDate]"
              :key="shift.id"
              class="shift-card"
              :class="{
                'current-user-shift': shift.staff.id === currentUserId,
              }"
              @click="userRole === 'O' ? editShift(shift.id) : null"
            >
              <p class="bold">
                {{ formatShiftTime(shift.start_shift, shift.end_shift) }}
              </p>
              <p>{{ shift.staff.first_name }} {{ shift.staff.last_name }}</p>
              <p>{{ shift.staff.role === "E" ? "Employee" : "Owner" }}</p>
            </div>
          </div>
          <div v-else class="fs-12 text-center">No Shifts</div>
        </div>
      </div>
    </div>

    <Modal
      :isVisible="isModalVisible"
      @update:isVisible="isModalVisible = $event"
    >
      <CreateShift
        @submit="submitShift"
        :shiftData="currentShiftData"
        :isEdit="isEditMode"
      />
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </Modal>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import DateSelector from "@/components/DateSelector.vue";
import Modal from "@/components/Modal.vue";
import CreateShift from "@/components/CreateShift.vue";
import { fetchCurrentStaffProfile } from "@/helpers/fetchCurrentStaffProfile";

export default {
  name: "HandleEmployeeRoster",
  components: {
    DateSelector,
    Modal,
    CreateShift,
  },
  data() {
    return {
      rosterData: [],
      daycareId: 1,
      startOfWeek: new Date(),
      isModalVisible: false,
      currentShiftData: null,
      isEditMode: false,
      userRole: null,
      errorMessage: "",
      currentUserId: null,
    };
  },
  computed: {
    weekDates() {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(this.startOfWeek);
        date.setDate(this.startOfWeek.getDate() + i);
        return {
          day: date.toLocaleDateString("en-US", { weekday: "long" }),
          date: date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          }),
          fullDate: date.toISOString().split("T")[0],
        };
      });
    },
    groupedShifts() {
      return this.rosterData.reduce((acc, shift) => {
        const day = new Date(shift.shift_day).toISOString().split("T")[0];
        acc[day] = acc[day] || [];
        acc[day].push(shift);
        return acc;
      }, {});
    },
  },
  methods: {
    async fetchRosterData() {
      try {
        const [weekStart, weekEnd] = [
          this.weekDates[0].fullDate,
          this.weekDates[6].fullDate,
        ];
        const response = await axiosInstance.get(
          `${endpoints.roster}?daycare=${this.daycareId}&start_date=${weekStart}&end_date=${weekEnd}`
        );
        this.rosterData = response.data;
      } catch (error) {
        console.error("Error fetching roster data:", error);
      }
    },
    showModal() {
      this.resetShiftData();
      this.isModalVisible = true;
    },
    resetShiftData() {
      this.currentShiftData = null;
      this.isEditMode = false;
    },
    async editShift(shiftId) {
      await this.fetchShiftData(shiftId);
    },
    async fetchShiftData(shiftId) {
      try {
        const response = await axiosInstance.get(
          `${endpoints.roster}${shiftId}/`
        );
        this.currentShiftData = response.data;
        this.isEditMode = true;
        this.isModalVisible = true;
      } catch (error) {
        console.error("Error fetching shift data:", error);
      }
    },
    async submitShift(shiftData) {
      const request = this.isEditMode
        ? axiosInstance.put(`${endpoints.roster}${shiftData.id}/`, shiftData)
        : axiosInstance.post(endpoints.roster, shiftData);

      try {
        const response = await request;
        console.log("Shift saved successfully:", response.data);
        await this.fetchRosterData();
        this.isModalVisible = false;
        this.errorMessage = "";
      } catch (error) {
        console.error("Error saving shift:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.non_field_errors
        ) {
          this.errorMessage = error.response.data.non_field_errors.join(", ");
        } else {
          this.errorMessage = "An error occurred while saving the shift.";
        }
      }
    },
    changeWeek(direction) {
      const newStartOfWeek = new Date(this.startOfWeek);
      newStartOfWeek.setDate(newStartOfWeek.getDate() + direction * 7);
      this.startOfWeek = newStartOfWeek;
      this.fetchRosterData();
    },
    updateWeekFromDate(date) {
      const selectedDate = new Date(date);
      const mondayOffset =
        selectedDate.getDay() === 0 ? -6 : 1 - selectedDate.getDay();
      this.startOfWeek = new Date(selectedDate);
      this.startOfWeek.setDate(selectedDate.getDate() + mondayOffset);
      this.fetchRosterData();
    },
    formatShiftTime(start, end) {
      return `${this.formatTime(start)} - ${this.formatTime(end)}`;
    },
    formatTime(date) {
      return new Date(date).toISOString().substring(11, 16);
    },
  },
  async mounted() {
    try {
      const profile = await fetchCurrentStaffProfile();
      this.userRole = profile.role;
      this.currentUserId = profile.id; // Set the current user ID here
      this.fetchRosterData();
    } catch (error) {
      console.error("Failed to fetch user role:", error);
    }
  },
};
</script>

<style scoped>
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

.current-user-shift {
  background-color: #d4edda;
}

.shift-card p {
  margin: 0;
  font-size: 12px;
}
</style>
