<template>
  <div class="mt-20">
    <form @submit.prevent="submitProduct">
      <div v-for="field in addProductFields" :key="field.id" class="form-group">
        <label :for="field.id">{{ field.label }}</label>
        <input
          v-if="field.type !== 'select'"
          :type="field.type"
          :id="field.id"
          v-model="productForm[field.model]"
          :required="field.required"
        />
        <select
          v-if="field.type === 'select'"
          :id="field.id"
          v-model="productForm[field.model]"
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
        Add Product
      </button>
    </form>

    <div v-if="successMessage" class="success mt-10">{{ successMessage }}</div>

    <div v-if="errorMessage" class="error mt-10">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import { addProductFields } from "@/config/formFieldConfig";

export default {
  name: "AddProduct",
  props: {
    daycareId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      addProductFields,
      productForm: {
        name: "",
        description: "",
        price: 0,
        capacity: 0,
        daycare: null,
      },
      successMessage: null,
      errorMessage: null,
    };
  },
  methods: {
    async submitProduct() {
      try {
        // Setting the daycare ID from the prop
        this.productForm.daycare = this.daycareId;

        const response = await axiosInstance.post(
          endpoints.product,
          this.productForm
        );
        console.log("Product added successfully:", response.data);

        // Setting the success message
        this.successMessage = "Product added successfully!";
        this.errorMessage = null; // Clear any previous error message

        // Optionally reset form or show success message
        this.resetForm();

        // Clears success message after a delay
        setTimeout(() => {
          this.successMessage = null;
        }, 3000); // Clear after 3 seconds
      } catch (error) {
        this.errorMessage = "Failed to add product. Please try again.";
        console.error("Error adding product:", error);
        this.successMessage = null; // Clears any previous success message
      }
    },
    resetForm() {
      this.productForm = {
        name: "",
        description: "",
        price: 0,
        capacity: 0,
        daycare: this.daycareId,
      };
    },
  },
};
</script>

<style scoped>
@import "@/utils/alerts.scss";
</style>
