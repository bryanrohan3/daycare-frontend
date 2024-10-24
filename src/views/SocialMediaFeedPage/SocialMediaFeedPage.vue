<template>
  <div class="mt-30">
    <div v-if="posts.length > 0">
      <div class="fs-12 mb-30" v-for="post in posts" :key="post.id">
        <p class="h-2 fs-12">{{ post.caption }}</p>
        <p>
          Posted on: {{ new Date(post.date_time_created).toLocaleString() }}
        </p>
        <p>Status: {{ post.status || "No status" }}</p>
        <p v-if="post.tagged_pets.length > 0">
          Tagged Pets: {{ post.tagged_pets.join(", ") }}
        </p>
        <p v-else>No pets tagged</p>
      </div>
    </div>
    <p v-else>No posts to display</p>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export default {
  name: "SocialMediaFeedPage",
  data() {
    return {
      posts: [],
    };
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axiosInstance.get(endpoints.posts);
        this.posts = response.data;
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
  },
};
</script>

<style scoped></style>
