<template>
  <div class="mt-30" @scroll.passive="handleScroll">
    <Comments />
    <div v-if="posts.length > 0">
      <div class="fs-12 mb-30" v-for="post in posts" :key="post.id">
        <p class="h-2 fs-12">{{ post.caption }}</p>
        <p>
          Posted on: {{ new Date(post.date_time_created).toLocaleString() }}
        </p>
        <p>Status: {{ post.status || "No status" }}</p>
        <p>Daycare: {{ post.daycare.daycare_name }}</p>
        <p v-if="post.tagged_pets.length > 0">
          Tagged Pets: {{ post.tagged_pets.join(", ") }}
        </p>
        <p v-else>No pets tagged</p>
      </div>
    </div>
    <p class="mt-30 text-center align-center fs-12" v-else>
      No posts to display
    </p>

    <!-- Loading spinner for infinite scroll -->
    <div v-if="loading" class="text-center mt-30">
      <p>Loading more posts...</p>
    </div>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import Comments from "@/components/Comments.vue";

export default {
  name: "SocialMediaFeedPage",
  data() {
    return {
      posts: [],
      next: null,
      loading: false,
    };
  },
  components: {
    Comments,
  },
  mounted() {
    this.fetchPosts();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async fetchPosts(pageUrl = endpoints.posts) {
      if (this.loading || !pageUrl) return;
      this.loading = true;

      try {
        const response = await axiosInstance.get(pageUrl);
        this.posts = [...this.posts, ...response.data.results];
        this.next = response.data.next;
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        this.loading = false;
      }
    },
    handleScroll() {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.offsetHeight;

      if (scrollTop + windowHeight >= documentHeight - 100 && this.next) {
        this.fetchPosts(this.next);
      }
    },
  },
};
</script>

<style scoped>
.pagination-controls {
  margin-top: 20px;
}
</style>
