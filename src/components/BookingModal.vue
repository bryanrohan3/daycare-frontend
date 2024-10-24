<template>
  <Modal :isVisible="isVisible" @update:isVisible="closeModal">
    <p class="h-2 bold">{{ isEdit ? "Edit Booking" : "Make a Booking" }}</p>

    <div v-if="currentStep === 1">
      <div v-for="field in createBookingFields" :key="field.id">
        <div v-if="field.type === 'text' && field.model === 'customerSearch'">
          <label class="fs-12 bold" :for="field.id">{{ field.label }}:</label>
          <input
            :id="field.id"
            :type="field.type"
            v-model="formModel.customerSearch"
            @input="debounceSearch"
            :placeholder="field.label"
            :required="field.required"
            class="mt-10 mb-10"
          />
          <ul v-if="customerResults.length">
            <li
              v-for="customer in customerResults"
              :key="customer.id"
              @click="selectCustomer(customer)"
              class="fs-12"
            >
              {{ customer.first_name }} {{ customer.last_name }}
            </li>
          </ul>
        </div>

        <div v-if="field.type === 'select' && field.model === 'selectedPet'">
          <label class="fs-12 bold" :for="field.id">{{ field.label }}:</label>
          <select
            :id="field.id"
            v-model="formModel.selectedPet"
            :required="field.required"
            class="mt-10 mb-10"
          >
            <option disabled value="">Select a pet</option>
            <option
              v-for="pet in selectedCustomer.pets"
              :key="pet.id"
              :value="pet.id"
            >
              {{ pet.pet_name }}
            </option>
          </select>
        </div>

        <div
          v-if="field.type === 'select' && field.model === 'selectedDaycare'"
        >
          <label class="fs-12 bold" :for="field.id">{{ field.label }}:</label>
          <select
            :id="field.id"
            v-model="formModel.selectedDaycare"
            @change="fetchProducts"
            :required="field.required"
            class="mt-10 mb-10"
          >
            <option disabled value="">Select a daycare</option>
            <option
              v-for="daycare in userDaycares"
              :key="daycare.id"
              :value="daycare.id"
            >
              {{ daycare.daycare_name }}
            </option>
          </select>
        </div>

        <div v-if="field.type === 'datetime-local'">
          <label class="fs-12 bold" :for="field.id">{{ field.label }}:</label>
          <input
            :id="field.id"
            :type="field.type"
            v-model="formModel[field.model]"
            :required="field.required"
            class="mt-10 mb-10"
          />
        </div>
      </div>

      <button class="button button--tertiary" @click="goToNextStep">
        Next
      </button>
    </div>

    <div v-else-if="currentStep === 2">
      <p class="h-2">Select Daycare Products</p>
      <ul class="fs-12">
        <li v-for="product in products" :key="product.id">
          <input
            type="checkbox"
            :value="product.id"
            v-model="formModel.selectedProducts"
          />
          {{ product.name }} - ${{ product.price }}
        </li>
      </ul>

      <div class="flex-row-space">
        <button class="button button--tertiary" @click="goToPreviousStep">
          Back
        </button>
        <button class="button button--tertiary" @click="confirmBooking">
          {{ isEdit ? "Update Booking" : "Confirm Booking" }}
        </button>

        <!-- These two buttons are not working yet but i have backend endpoints setup -->
        <button
          v-if="isEdit"
          class="button button--tertiary"
          @click="deleteBooking"
        >
          Delete Booking
        </button>

        <button
          v-if="isEdit"
          class="button button--tertiary"
          @click="toggleCheckIn"
          :disabled="loading"
        >
          {{
            loading
              ? "Processing..."
              : booking.checked_in
              ? "Check Out"
              : "Check In"
          }}
        </button>
      </div>

      <div v-if="loading" class="mt-10 fs-12 success">Loading...</div>

      <div v-if="errorMessage" class="mt-10 error">{{ errorMessage }}</div>
    </div>
  </Modal>
</template>

<script>
import { createBookingFields } from "@/config/formFieldConfig"; // Import the fields config
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import Modal from "@/components/Modal.vue";
import _ from "lodash";

export default {
  name: "BookingModal",
  components: { Modal },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    daycareId: {
      type: String,
      required: true,
    },
    booking: {
      type: Object,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      createBookingFields,
      currentStep: 1,
      errorMessage: "",
      loading: false,
      formModel: {
        customerSearch: "",
        selectedPet: null,
        selectedDaycare: null,
        startTime: "",
        endTime: "",
        selectedProducts: [],
      },
      customerResults: [],
      selectedCustomer: {
        pets: [],
      },
      userDaycares: [],
      products: [],
    };
  },

  methods: {
    debounceSearch: _.debounce(async function () {
      if (this.formModel.customerSearch) {
        try {
          const response = await axiosInstance.get(
            `customer-profile/?name=${this.formModel.customerSearch}`
          );
          console.log(response.data); // Log the API response
          this.customerResults = response.data;
        } catch (error) {
          console.error("Error fetching customers:", error);
        }
      } else {
        this.customerResults = [];
      }
    }, 300),

    selectCustomer(customer) {
      this.selectedCustomer = customer;
      this.formModel.customerSearch = `${customer.first_name} ${customer.last_name}`;
      this.customerResults = [];
      this.selectedCustomer.pets = customer.pets;
    },

    async fetchDaycares() {
      try {
        const response = await axiosInstance.get(endpoints.currentStaffProfile);
        this.userDaycares = response.data.daycares_names;
      } catch (error) {
        console.error("Error fetching daycares:", error);
      }
    },

    async fetchProducts() {
      if (this.formModel.selectedDaycare) {
        try {
          const response = await axiosInstance.get(
            `product/?daycare=${this.formModel.selectedDaycare}`
          );
          this.products = response.data;
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    },

    goToNextStep() {
      if (this.formModel.selectedDaycare && this.formModel.selectedPet) {
        this.currentStep = 2;
      } else {
        alert("Please select both a pet and a daycare to proceed.");
      }
    },
    goToPreviousStep() {
      this.currentStep = 1;
    },

    async deleteBooking() {
      try {
        await axiosInstance.patch(
          `${endpoints.bookings}${this.booking.id}/cancel_booking/`
        );
        this.$emit("saveBooking");
        this.closeModal();
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = Object.values(error.response.data).join(", ");
        } else {
          this.errorMessage = "An error occurred while deleting the booking.";
        }
        console.error("Error deleting booking:", error);
      }
    },

    async confirmBooking() {
      const bookingData = {
        customer: this.selectedCustomer.id,
        pet: this.formModel.selectedPet,
        daycare: this.formModel.selectedDaycare,
        start_time: this.formModel.startTime,
        end_time: this.formModel.endTime,
        products: this.formModel.selectedProducts,
      };

      try {
        if (this.isEdit) {
          await axiosInstance.put(
            `${endpoints.bookings}${this.booking.id}/`,
            bookingData
          );
        } else {
          await axiosInstance.post(endpoints.bookings, bookingData);
        }
        this.$emit("saveBooking");
        this.closeModal();
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = Object.values(error.response.data).join(", ");
        } else {
          this.errorMessage = "An unknown error occurred. Please try again.";
        }
        console.error("Error saving booking:", error);
      }
    },
    async toggleCheckIn() {
      this.loading = true;
      try {
        const endpoint = this.booking.checked_in
          ? `${endpoints.bookings}${this.booking.id}/check_out/`
          : `${endpoints.bookings}${this.booking.id}/check_in/`;

        await axiosInstance.patch(endpoint);
        this.booking.checked_in = !this.booking.checked_in;

        setTimeout(() => {
          this.loading = false;
        }, 1000);
      } catch (error) {
        this.loading = false;
        console.error("Error toggling check-in status:", error);
      }
    },
    closeModal() {
      this.$emit("update:isVisible", false);
      this.resetForm();
      this.errorMessage = "";
    },

    resetForm() {
      this.formModel = {
        customerSearch: "",
        selectedPet: null,
        selectedDaycare: null,
        startTime: "",
        endTime: "",
        selectedProducts: [],
      };
      this.selectedCustomer = { pets: [] };
      this.currentStep = 1;
    },
    populateFormData() {
      this.selectedCustomer = {
        id: this.booking.customer,
        pets: [this.booking.pet_details],
      };
      this.formModel = {
        customerSearch: this.booking.customer_details.full_name,
        selectedPet: this.booking.pet,
        selectedDaycare: this.booking.daycare,
        startTime: this.formatDateTimeForInput(this.booking.start_time),
        endTime: this.formatDateTimeForInput(this.booking.end_time),
        selectedProducts: this.booking.products,
      };
      this.booking.check_in = this.booking.check_in;
      this.fetchProducts();
    },

    formatDateTimeForInput(dateTime) {
      return new Date(dateTime).toISOString().slice(0, 16);
    },
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.fetchDaycares();
        if (this.isEdit && this.booking) {
          this.populateFormData();
        }
      }
    },
  },
};
</script>
