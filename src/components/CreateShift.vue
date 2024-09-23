<template>
  <div>
    <h2 class="h-2">{{ isEdit ? "Edit Shift" : "Add Shift" }}</h2>
    <form @submit.prevent="submitShift">
      <!-- Existing form fields -->
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
      </div>
      <div class="flex-row-space">
        <button type="submit" class="button button--tertiary mt-10">
          Save Shift
        </button>
        <button
          v-if="isEdit"
          @click.prevent="deleteShift"
          class="button button--tertiary mt-10"
        >
          Delete Shift
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { shiftFormFields } from "@/config/formFieldConfig";
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "CreateShift",
  props: {
    shiftData: {
      type: Object,
      default: () => ({}),
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formFields: shiftFormFields,
      formData: {
        daycare: "",
        staff_id: "",
        start_shift: "",
        end_shift: "",
        shift_day: "",
      },
      daycares: [],
      staffOptions: [],
    };
  },
  async created() {
    await this.fetchDaycares();
    if (this.isEdit) {
      this.populateFormData();
    }
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
    async deleteShift() {
      if (confirm("Are you sure you want to deactivate this shift?")) {
        try {
          await axiosInstance.patch(
            `${endpoints.roster}${this.shiftData.id}/deactivate/`
          );
          console.log("Shift deactivated successfully");
          this.$emit("delete"); // Emit an event to notify parent component
          this.resetForm(); // Optionally reset the form
          this.isModalVisible = false; // Close the modal
        } catch (error) {
          console.error("Error deactivating shift:", error);
        }
      }
    },
    async fetchStaff(daycareId) {
      if (daycareId) {
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

          if (this.isEdit) {
            this.formData.staff_id = this.shiftData.staff.id; // Set the current staff ID
          }
        } catch (error) {
          console.error("Error fetching staff:", error);
        }
      }
    },
    formatDateTimeForInput(dateTime) {
      const date = new Date(dateTime);
      return date.toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:MM'
    },

    handleSelectChange(fieldId) {
      if (fieldId === "daycare") {
        this.staffOptions = [];
        this.formData.staff_id = "";
        this.fetchStaff(this.formData.daycare);
      }
    },
    populateFormData() {
      if (this.shiftData) {
        this.formData = {
          daycare: this.shiftData.daycare,
          staff_id: this.shiftData.staff.id,
          start_shift: this.formatDateTimeForInput(this.shiftData.start_shift),
          end_shift: this.formatDateTimeForInput(this.shiftData.end_shift),
          shift_day: this.shiftData.shift_day,
        };
        this.fetchStaff(this.shiftData.daycare);
      }
    },

    submitShift() {
      const request = this.isEdit
        ? axiosInstance.put(
            `${endpoints.roster}${this.shiftData.id}/`,
            this.formData
          )
        : axiosInstance.post(endpoints.roster, this.formData);

      request
        .then((response) => {
          console.log("Shift saved successfully:", response.data);
          this.$emit("submit", this.formData);
          this.resetForm();
        })
        .catch((error) => {
          console.error("Error saving shift:", error);
        });
    },
    resetForm() {
      this.formData = {
        daycare: "",
        staff_id: "",
        start_shift: "",
        end_shift: "",
        shift_day: "",
      };
      this.staffOptions = [];
    },
  },
};
</script>
