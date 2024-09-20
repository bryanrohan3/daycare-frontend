<template>
  <div>
    <h2 class="h-2">Add Shift</h2>
    <form @submit.prevent="submitShift">
      <div v-for="field in formFields" :key="field.id" class="form-group">
        <label class="mt-10" :for="field.id">{{ field.label }}</label>
        <input
          v-if="field.type !== 'select'"
          :id="field.id"
          :type="field.type"
          v-model="formData[field.model]"
          :required="field.required"
        />
        <select
          v-if="field.type === 'select'"
          :id="field.id"
          v-model="formData[field.model]"
          :required="field.required"
          @change="handleSelectChange(field.id)"
        >
          <option
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
        <!-- Add other input types as needed -->
      </div>
      <button type="submit" class="button button--tertiary mt-10">
        Save Shift
      </button>
    </form>
  </div>
</template>

<script>
import { shiftFormFields } from "@/config/formFieldConfig";
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "CreateShift",
  data() {
    return {
      formFields: shiftFormFields,
      formData: {
        daycare: "",
        staff_id: "", // Change to 'staff_id' to match backend
        start_shift: "",
        end_shift: "",
        shift_day: "",
      },
      daycares: [],
      staffOptions: [], // This should hold staff options for the selected daycare
    };
  },
  async created() {
    await this.fetchDaycares();
  },
  methods: {
    async fetchDaycares() {
      try {
        const response = await axiosInstance.get(endpoints.currentStaffProfile);
        this.daycares = response.data.daycares_names;
        this.formFields.find((field) => field.id === "daycare").options =
          this.daycares.map((daycare) => ({
            value: daycare.id,
            text: daycare.daycare_name,
          }));
      } catch (error) {
        console.error("Error fetching daycares:", error);
      }
    },
    async fetchStaff(daycareId) {
      try {
        const response = await axiosInstance.get(
          endpoints.getDaycareById(daycareId)
        );
        const staff = response.data.staff;
        this.staffOptions = staff.map((staff) => ({
          value: staff.id,
          text: `${staff.user.first_name} ${staff.user.last_name}`,
        }));
        const staffField = this.formFields.find(
          (field) => field.id === "staff"
        );
        staffField.options = this.staffOptions;
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    },
    handleSelectChange(fieldId) {
      if (fieldId === "daycare") {
        this.staffOptions = []; // Clear staff options
        this.formData.staff_id = ""; // Reset staff selection
        this.fetchStaff(this.formData.daycare);
      }
    },
    submitShift() {
      axiosInstance
        .post(endpoints.roster, this.formData)
        .then((response) => {
          console.log("Shift added successfully:", response.data);
          this.$emit("submit", this.formData);
          this.formData = {
            daycare: "",
            staff_id: "", // Reset to 'staff_id'
            start_shift: "",
            end_shift: "",
            shift_day: "",
          };
          this.staffOptions = [];
        })
        .catch((error) => {
          console.error("Error adding shift:", error);
        });
    },
  },
};
</script>
