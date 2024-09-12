<template>
  <div class="mt-20">
    <form @submit.prevent="submitEmployee">
      <div
        v-for="field in ownerCreateEmployeeFields"
        :key="field.id"
        class="form-group"
      >
        <label class="mt-10" :for="field.id">{{ field.label }}</label>
        <input
          v-if="field.type !== 'select'"
          :type="field.type"
          :id="field.id"
          v-model="employeeForm[field.model]"
          :required="field.required"
        />
        <select
          v-if="field.type === 'select'"
          :id="field.id"
          v-model="employeeForm[field.model]"
          :required="field.required"
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

      <button type="submit" class="button button--tertiary mt-10">
        Create Employee
      </button>
    </form>

    <!-- Success message alert -->
    <div v-if="successMessage" class="success">{{ successMessage }}</div>

    <!-- Error message alert -->
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import { ownerCreateEmployeeFields } from "@/config/formFieldConfig"; // Import form fields

export default {
  name: "CreateEmployee",
  props: {
    selectedDaycareId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      ownerCreateEmployeeFields,
      employeeForm: {
        user: {
          username: "",
          password: "",
          email: "",
          first_name: "",
          last_name: "",
        },
        phone: "",
        role: "E",
        daycare: [], // This will be set using the selectedDaycareId prop
      },
      successMessage: null, // Add success message state
      errorMessage: null,
    };
  },
  methods: {
    async submitEmployee() {
      try {
        // Set the daycare ID from the prop
        this.employeeForm.daycare = [this.selectedDaycareId];

        const response = await axiosInstance.post(
          endpoints.staffProfile,
          this.employeeForm
        );
        console.log("Employee created successfully:", response.data);

        // Set the success message
        this.successMessage = "Employee created successfully!";
        this.errorMessage = null; // Clear any previous error message

        // Optionally reset form or show success message
        this.resetForm();

        // Clear success message after a delay
        setTimeout(() => {
          this.successMessage = null;
        }, 3000); // Clear after 3 seconds
      } catch (error) {
        this.errorMessage = "Failed to create employee. Please try again.";
        console.error("Error creating employee:", error);
        this.successMessage = null; // Clear any previous success message
      }
    },
    resetForm() {
      this.employeeForm = {
        user: {
          username: "",
          password: "",
          email: "",
          first_name: "",
          last_name: "",
        },
        phone: "",
        role: "E",
        daycare: [this.selectedDaycareId],
      };
    },
  },
};
</script>
