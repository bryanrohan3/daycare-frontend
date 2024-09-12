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

    <div v-if="successMessage" class="success mt-10">{{ successMessage }}</div>

    <div v-if="errorMessage" class="error mt-10">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import { ownerCreateEmployeeFields } from "@/config/formFieldConfig";

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
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        role: "E",
        daycare: [], // This will be set using the selectedDaycareId prop
      },
      successMessage: null,
      errorMessage: null,
    };
  },
  methods: {
    async submitEmployee() {
      try {
        this.employeeForm.daycares = [this.selectedDaycareId]; // Change this line

        const formattedData = {
          user: {
            username: this.employeeForm.username,
            password: this.employeeForm.password,
            email: this.employeeForm.email,
            first_name: this.employeeForm.first_name,
            last_name: this.employeeForm.last_name,
          },
          phone: this.employeeForm.phone,
          role: this.employeeForm.role,
          daycares: this.employeeForm.daycares, // Change this line
        };

        const response = await axiosInstance.post(
          endpoints.addEmployee,
          formattedData
        );
        console.log("Employee created successfully:", response.data);

        // Set the success message
        this.successMessage = "Employee created successfully!";
        this.errorMessage = null;

        // Optionally reset form or show success message
        this.resetForm();

        // Clear success message after a delay
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        this.errorMessage = "Failed to create employee. Please try again.";
        console.error("Error creating employee:", error.response.data);
        this.successMessage = null;
      }
    },
    resetForm() {
      this.employeeForm = {
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        role: "E",
        daycare: [this.selectedDaycareId],
      };
    },
  },
};
</script>
