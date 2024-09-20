<template>
  <div>
    <p class="h-1">Employee Roster</p>
    <div class="flex-row-space">
      <DateSelector @apply="updateWeekFromDate" />
      <!-- if the user role is Owner they can see , if not they cant -->
      <v-if v-if="userRole === 'O'">
        <button @click="showModal" class="button button--tertiary mt-5 pad-5">
          Add Shift
        </button>
      </v-if>
    </div>

    <!-- Week Header with Navigation Buttons -->
    <div class="flex-row-space mb-20 mt-20">
      <button @click="changeWeek(-1)" class="button button--tertiary">
        ← Last Week
      </button>
      <button @click="changeWeek(1)" class="button button--tertiary">
        Next Week →
      </button>
    </div>

    <div v-if="rosterData.length">
      <div class="flex-row-space mb-20">
        <div v-for="(date, index) in weekDates" :key="index" class="day-header">
          {{ date.day }}<br />{{ date.date }}
        </div>
      </div>
      <div class="flex-row-space">
        <div v-for="(date, index) in weekDates" :key="index" class="day-column">
          <div v-if="groupedShifts[date.fullDate]" class="shifts-container">
            <div
              v-for="shift in groupedShifts[date.fullDate]"
              :key="shift.id"
              class="shift-card"
            >
              <p class="bold">
                {{ formatShiftTime(shift.start_shift, shift.end_shift) }}
              </p>
              <p>
                {{ shift.staff.first_name }}
                {{ shift.staff.last_name }}
              </p>
              <p>{{ shift.staff.role === "E" ? "Employee" : "Owner" }}</p>
            </div>
          </div>
          <div v-else class="fs-12 text-center">No Shifts</div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No data available</p>
    </div>

    <!-- Modal for adding shift -->
    <Modal
      :isVisible="isModalVisible"
      @update:isVisible="isModalVisible = $event"
    >
      <CreateShift @submit="submitShift" />
    </Modal>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import DateSelector from "@/components/DateSelector.vue";
import Modal from "@/components/Modal.vue";
import CreateShift from "@/components/CreateShift.vue";

export default {
  name: "EmployeeRosterPage",
  components: {
    DateSelector,
    Modal,
    CreateShift,
  },
  data() {
    return {
      rosterData: [], // To hold the fetched roster data
      daycareId: 1, // Replace with dynamic value if needed
      startOfWeek: new Date(), // Initialize with current week's Monday
      isModalVisible: false, // Controls the visibility of the modal
    };
  },
  computed: {
    weekDates() {
      // Calculate week dates (Monday to Sunday)
      const weekDates = [];
      const startDate = new Date(this.startOfWeek);
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        weekDates.push({
          day: date.toLocaleDateString("en-US", { weekday: "long" }),
          date: date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          }),
          fullDate: date.toISOString().split("T")[0], // For API requests
        });
      }
      return weekDates;
    },
    formattedWeek() {
      // Format the week header (e.g., "Mon, Sep 16 - Sun, Sep 22")
      const start = this.weekDates[0];
      const end = this.weekDates[6];
      return `${start.day}, ${start.date} - ${end.day}, ${end.date}`;
    },
    groupedShifts() {
      // Group shifts by day
      return this.rosterData.reduce((acc, shift) => {
        const shiftDate = new Date(shift.shift_day);
        const day = shiftDate.toISOString().split("T")[0];
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(shift);
        return acc;
      }, {});
    },
  },
  methods: {
    async fetchRosterData() {
      try {
        // Fetch data for the full week
        const weekStart = this.weekDates[0].fullDate;
        const weekEnd = this.weekDates[6].fullDate;
        const response = await axiosInstance.get(
          `${endpoints.roster}?daycare=${this.daycareId}&start_date=${weekStart}&end_date=${weekEnd}`
        );
        this.rosterData = response.data;
      } catch (error) {
        console.error("Error fetching roster data:", error);
      }
    },
    showModal() {
      this.isModalVisible = true;
    },
    submitShift() {
      console.log("Shift form submitted");
      // Add your shift submission logic here
      this.isModalVisible = false; // Hide the modal after submission
    },
    changeWeek(direction) {
      // Adjust the start of the week by adding/subtracting weeks
      const newStartOfWeek = new Date(this.startOfWeek);
      newStartOfWeek.setDate(newStartOfWeek.getDate() + direction * 7);
      this.startOfWeek = newStartOfWeek;
      this.fetchRosterData(); // Fetch data for the new week
    },
    updateWeekFromDate(date) {
      // Update the start of the week based on the selected date
      const selectedDate = new Date(date);
      const dayOfWeek = selectedDate.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const newStartOfWeek = new Date(selectedDate);
      newStartOfWeek.setDate(selectedDate.getDate() + mondayOffset);
      this.startOfWeek = newStartOfWeek;
      this.fetchRosterData(); // Fetch data for the new week
    },
    formatShiftTime(start, end) {
      // Parse the start and end times
      const startTime = new Date(start);
      const endTime = new Date(end);

      // Format the times in 24-hour format without timezone conversion
      const startTimeFormatted = startTime.toISOString().substring(11, 16); // Extract HH:MM from ISO string
      const endTimeFormatted = endTime.toISOString().substring(11, 16); // Extract HH:MM from ISO string

      return `${startTimeFormatted} - ${endTimeFormatted}`;
    },
  },
  mounted() {
    this.fetchRosterData(); // Fetch data when the component is mounted
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

.week-content {
  display: flex;
  justify-content: space-between;
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

.no-data {
  text-align: center;
  color: #888;
  font-size: 12px;
}
</style>
