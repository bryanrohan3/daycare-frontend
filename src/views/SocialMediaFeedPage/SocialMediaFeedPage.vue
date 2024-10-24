<template>
  <div class="mt-30">
    <div v-if="posts.length > 0">
      <div class="fs-12 mb-30" v-for="post in posts" :key="post.id">
        <p class="h-2 fs-12">{{ post.caption }}</p>
        <p>
          Posted on: {{ new Date(post.date_time_created).toLocaleString() }}
        </p>
        <p v-if="post.tagged_pets.length > 0">
          Tagged Pets: {{ post.tagged_pets.join(", ") }}
        </p>
        <p v-else>No pets tagged</p>
      </div>
    </div>
    <p class="mt-30 text-center align-centre fs-12" v-else>
      No posts to display
    </p>

    <div class="pagination-controls">
      <button @click="fetchPosts(previous)" :disabled="!previous">
        Previous
      </button>
      <button @click="fetchPosts(next)" :disabled="!next">Next</button>
    </div>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "SocialMediaFeedPage",
  data() {
    return {
      posts: [],
      next: null,
      previous: null,
    };
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts(pageUrl = endpoints.posts) {
      try {
        const response = await axiosInstance.get(pageUrl);
        this.posts = response.data.results;
        this.next = response.data.next;
        this.previous = response.data.previous;
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
  },
};
</script>

<style scoped>
.pagination-controls {
  margin-top: 20px;
}
button {
  margin-right: 10px;
}
</style>
