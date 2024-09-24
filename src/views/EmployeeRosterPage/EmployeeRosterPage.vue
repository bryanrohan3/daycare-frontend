<template>
  <div>
    <p class="h-1">Employee Roster</p>
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
      <HandleEmployeeRoster />
    </div>

    <div v-else-if="activeTab === 'unavailability'">
      <p>Unavailability tab content goes here.</p>
      <!-- I'm going to have a list here where they can add new unavailability
      - E.g Thursdays
      - E.g 9:00 AM - 5:00 PM on X Date 
      -->
    </div>
  </div>
</template>

<script>
import HandleEmployeeRoster from "@/components/HandleEmployeeRoster.vue";

export default {
  name: "EmployeeRosterPage",
  components: {
    HandleEmployeeRoster,
  },
  data() {
    return {
      activeTab: "roster",
    };
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
