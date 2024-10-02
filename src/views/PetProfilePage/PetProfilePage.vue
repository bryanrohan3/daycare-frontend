<template>
  <div v-if="pet">
    <!-- Breadcrumb navigation !! Will make into Component soon -->
    <nav v-if="isOwner" aria-label="breadcrumb">
      <ol class="breadcrumb fs-12">
        <li class="breadcrumb-item fs-12">
          <router-link to="/customer/pets/">Pets</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ pet.pet_name }}
        </li>
      </ol>
    </nav>

    <p class="h-1">{{ pet.pet_name }}</p>

    <div v-if="isOwner || pet.is_public">
      <Tabs :tabs="tabs">
        <template v-slot="{ currentTab }">
          <div class="fs-12" v-if="currentTab === 'about'">
            <!-- About Me Section -->
            <template v-if="isOwner || pet.is_public">
              <p>{{ pet.pet_bio }}</p>
              <p>{{ pet.pet_types_display.join(", ") }}</p>
              <p>
                <span
                  v-for="(customer, index) in pet.customers"
                  :key="customer.id"
                >
                  {{ customer.full_name }}
                  <span v-if="index < pet.customers.length - 1">, </span>
                </span>
              </p>
            </template>
            <template v-else>
              <p class="text-center">This pet is not public.</p>
            </template>
          </div>

          <div class="fs-12 mt-30 text-center" v-if="currentTab === 'posts'">
            <p>No posts available.</p>
          </div>
        </template>
      </Tabs>
    </div>

    <div v-else class="text-center">
      <p class="fs-12 mt-30">Account is on Private</p>
    </div>
  </div>

  <div class="h-small mt-30 text-center" v-else>Nothing Found</div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import Tabs from "@/components/Tabs.vue";

export default {
  name: "PetProfilePage",
  components: {
    Tabs,
  },
  data() {
    return {
      pet: null,
      currentUser: null,
      isOwner: false,
      tabs: [
        { name: "about", label: "About Me" },
        { name: "posts", label: "Posts" },
      ],
    };
  },
  async created() {
    await this.fetchPetDetails();
    await this.fetchCurrentUser();
  },
  methods: {
    async fetchPetDetails() {
      try {
        const response = await axiosInstance.get(
          endpoints.getPet(this.$route.params.id)
        );
        this.pet = response.data;
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    },
    async fetchCurrentUser() {
      try {
        const response = await axiosInstance.get(endpoints.customerProfile);
        this.currentUser = response.data;
        const currentUserId = this.currentUser.id;

        this.isOwner = this.pet.customers.some(
          (customer) => customer.id === currentUserId
        );
      } catch (error) {
        if (error.response && error.response.status === 403) {
          return;
        } else {
          console.error("Error fetching current user data:", error);
        }
      }
    },
  },
};
</script>

<style>
.breadcrumb {
  display: flex;
  list-style: none;
  padding: 0;
  margin-bottom: 1rem;
}
.breadcrumb-item + .breadcrumb-item::before {
  content: " / ";
  padding: 0 5px;
}
.breadcrumb-item > .router-link-active {
  text-decoration: none;
}
</style>
