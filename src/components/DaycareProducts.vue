<template>
  <div>
    <button
      @click="toggleEditMode"
      class="button button--tertiary button--top-right"
    >
      {{ isEditing ? "Save" : "Edit" }}
    </button>
    <table v-if="products.length" class="table table-dealer">
      <thead>
        <tr class="table-header">
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Capacity</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td v-if="isEditing">
            <input v-model="product.name" />
          </td>
          <td v-else>
            {{ product.name }}
          </td>

          <td v-if="isEditing">
            <input v-model="product.description" />
          </td>
          <td v-else>
            {{ product.description }}
          </td>

          <td v-if="isEditing">
            <input v-model="product.price" type="decimal" />
          </td>
          <td v-else>
            {{ product.price }}
          </td>

          <td v-if="isEditing">
            <input v-model="product.capacity" type="number" />
          </td>
          <td v-else>
            {{ product.capacity }}
          </td>

          <td v-if="isEditing">
            <select v-model="product.is_active">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </td>
          <td v-else>
            {{ product.is_active ? "Active" : "Inactive" }}
          </td>
        </tr>
      </tbody>
    </table>
    <p class="h-small h-center mt-30" v-else>
      No products available for this daycare.
    </p>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "DaycareProducts",
  props: {
    selectedDaycareId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      products: [],
      isEditing: false,
    };
  },
  watch: {
    selectedDaycareId(newVal) {
      if (newVal) {
        this.fetchProducts(newVal);
      }
    },
  },
  methods: {
    async fetchProducts(selectedDaycareId) {
      try {
        const response = await axiosInstance.get(
          `/daycare/${selectedDaycareId}`
        );
        this.products = response.data.products || [];
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    toggleEditMode() {
      if (this.isEditing) {
        this.saveChanges();
      }
      this.isEditing = !this.isEditing;
    },
    async saveChanges() {
      try {
        // Use the endpoint for updating a product
        await Promise.all(
          this.products.map((product) =>
            axiosInstance.put(endpoints.updateProduct(product.id), product)
          )
        );
        alert("Changes saved successfully.");
      } catch (error) {
        console.error("Error saving changes:", error);
        alert("Failed to save changes.");
      }
    },
  },
  created() {
    if (this.selectedDaycareId) {
      this.fetchProducts(this.selectedDaycareId);
    }
  },
};
</script>
