<template>
  <Modal :isVisible="isVisible" @update:isVisible="closeModal">
    <p class="h-2">Make a Booking</p>

    <div v-if="currentStep === 1">
      <div v-for="field in createBookingFields" :key="field.id">
        <div v-if="field.type === 'select' && field.model === 'selectedPet'">
          <label class="fs-12 bold" :for="field.id">{{ field.label }}:</label>
          <select
            :id="field.id"
            v-model="formModel.selectedPet"
            :required="field.required"
            class="mt-10 mb-10"
          >
            <option disabled value="">Select a pet</option>
            <option v-for="pet in pets" :key="pet.id" :value="pet.id">
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
          Confirm Booking
        </button>
      </div>

      <div v-if="errorMessage" class="mt-10 error">{{ errorMessage }}</div>
    </div>
  </Modal>
</template>

<script>
import { createBookingFields } from "@/config/formFieldConfig";
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import Modal from "@/components/Modal.vue";
import _ from "lodash";
import { fetchCurrentCustomerProfile } from "@/helpers/fetchCurrentCustomerProfile";

export default {
  name: "CustomerBookingModal",
  components: { Modal },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      createBookingFields,
      currentStep: 1,
      errorMessage: "",
      formModel: {
        selectedPet: null,
        selectedDaycare: null,
        startTime: "",
        endTime: "",
        selectedProducts: [],
      },
      pets: [],
      userDaycares: [],
      products: [],
    };
  },

  methods: {
    async fetchPets() {
      try {
        const response = await axiosInstance.get(endpoints.customerProfile);
        this.pets = response.data.pets;
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    },

    async fetchDaycares() {
      try {
        const response = await axiosInstance.get("daycare/?search=");
        this.userDaycares = response.data;
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

    async confirmBooking() {
      try {
        const customerProfile = await fetchCurrentCustomerProfile();

        // I need to add this into config file ...
        const bookingData = {
          customer: customerProfile.id,
          pet: this.formModel.selectedPet,
          daycare: this.formModel.selectedDaycare,
          start_time: this.formModel.startTime,
          end_time: this.formModel.endTime,
          products: this.formModel.selectedProducts,
        };

        const response = await axiosInstance.post(
          endpoints.bookings,
          bookingData
        );
        const booking = response.data;

        this.closeModal();
        this.resetForm();

        if (booking.is_waitlist) {
          const confirmed = confirm(
            "The daycare is full. Do you want to be added to the waitlist?"
          );
          if (confirmed) {
            await this.addToWaitlist(booking.id);
          }
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = Object.values(error.response.data).join(", ");
        } else {
          this.errorMessage = "An unknown error occurred. Please try again.";
        }
        console.error("Error creating booking:", error);
      }
    },
    async addToWaitlist(bookingId) {
      try {
        const response = await axiosInstance.post(
          `${endpoints.bookings}${bookingId}/accept-waitlist/`
        );
        alert("You have been successfully added to the waitlist.");
      } catch (error) {
        console.error("Error adding to waitlist:", error);
        this.errorMessage = "Failed to add to the waitlist.";
      }
    },
    closeModal() {
      this.$emit("update:isVisible", false);
      this.resetForm();
      this.errorMessage = "";
    },

    resetForm() {
      this.formModel = {
        selectedPet: null,
        selectedDaycare: null,
        startTime: "",
        endTime: "",
        selectedProducts: [],
      };
      this.currentStep = 1;
    },
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.fetchPets();
        this.fetchDaycares();
      }
    },
  },
};
</script>
