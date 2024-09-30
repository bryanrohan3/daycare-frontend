<template>
  <div>
    <div class="form-row">
      <p class="h-1">Customer Pet Roster</p>
      <button @click="toggleEditMode" class="button button--tertiary mt-30">
        {{ isEditing ? "Save" : "Edit" }}
      </button>
      <button @click="showAddPetModal" class="button button--tertiary mt-30">
        Add Pet
      </button>
    </div>

    <table v-if="pets.length" class="table table-dealer">
      <thead>
        <tr class="table-header">
          <th>Pet Name</th>
          <th>Pet Bio</th>
          <th>Type</th>
          <th>Public</th>
          <th>Active</th>
          <th>Customers</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="pet in pets"
          :key="pet.id"
          @click="!isEditing && goToPetProfile(pet.id)"
        >
          <td v-if="isEditing">
            <input v-model="pet.pet_name" />
          </td>
          <td v-else>{{ pet.pet_name }}</td>

          <td v-if="isEditing">
            <input v-model="pet.pet_bio" />
          </td>
          <td v-else>{{ pet.pet_bio }}</td>

          <td>
            <span v-if="pet.pet_types_display.length">
              {{ pet.pet_types_display.join(", ") }}
            </span>
            <span v-else>No Type Available</span>
          </td>

          <td v-if="isEditing">
            <select v-model="pet.is_public">
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </td>
          <td v-else>{{ pet.is_public ? "Yes" : "No" }}</td>

          <td v-if="isEditing">
            <select v-model="pet.is_active">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </td>
          <td v-else>{{ pet.is_active ? "Active" : "Inactive" }}</td>

          <td>
            <span v-for="(customer, index) in pet.customers" :key="customer.id">
              {{ customer.full_name
              }}<span v-if="index < pet.customers.length - 1">, </span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <p class="h-small h-center mt-30" v-else>
      No pets available for this customer.
    </p>

    <Modal
      :isVisible="isAddPetModalVisible"
      @update:isVisible="isAddPetModalVisible = $event"
    >
      <CreatePet @petAdded="fetchCustomerPets" />
    </Modal>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import Modal from "@/components/Modal.vue";
import CreatePet from "@/components/CreatePet.vue";

export default {
  name: "CustomerPetPage",
  components: {
    Modal,
    CreatePet,
  },
  data() {
    return {
      pets: [],
      isEditing: false,
      isAddPetModalVisible: false,
    };
  },
  methods: {
    async fetchCustomerPets() {
      try {
        const response = await axiosInstance.get(endpoints.customerProfile);
        this.pets = response.data.pets || [];
      } catch (error) {
        console.error("Error fetching customer pets:", error);
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
        await Promise.all(
          this.pets.map((pet) =>
            axiosInstance.put(endpoints.updatePet(pet.id), pet)
          )
        );
        alert("Changes saved successfully.");
      } catch (error) {
        console.error("Error saving changes:", error);
        alert("Failed to save changes.");
      }
    },
    showAddPetModal() {
      this.isAddPetModalVisible = true;
    },
    goToPetProfile(id) {
      // Navigate to the pet profile page
      this.$router.push({ name: "PetProfile", params: { id } });
    },
  },
  created() {
    this.fetchCustomerPets();
  },
};
</script>
