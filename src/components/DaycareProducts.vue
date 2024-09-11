<template>
  <div>
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
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.capacity }}</td>
          <td>{{ product.is_active ? "Active" : "Inactive" }}</td>
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
  },
  created() {
    if (this.selectedDaycareId) {
      this.fetchProducts(this.selectedDaycareId);
    }
  },
};
</script>
