<template>
    <div class="mt-20 align-center justify-center" @scroll.passive="handleScroll">
      <div v-if="posts.length > 0">
        <div class="fs-12 mb-30" v-for="post in posts" :key="post.id">
          <div class="flex-row-space">
            <p class="bold">{{ post.daycare.daycare_name }}</p>
            <p>{{ new Date(post.date_time_created).toLocaleString() }} ({{ post.status || "No status" }})</p>
          </div>
          <p>
            <span v-if="post.pet_names.length > 0">
              {{ post.pet_names.map((pet) => pet.pet_name).join(", ") }}
            </span>
            <p class="h-2 fs-12">{{ post.caption }}</p>
  
            <!-- Comments Component -->
            <Comments :postId="post.id" />
  
            <!-- Like Component -->
            <Like
            :postId="post.id"
            :initialLiked="post.liked"
            :initialLikeCount="post.like_count"
            @update-like="handleLikeUpdate(post.id, $event)"
            />
          </p>
        </div>
      </div>
      <p class="mt-30 text-center align-center fs-12" v-else>
        No posts to display
      </p>
  
      <div v-if="loading" class="text-center mt-30">
        <p>Loading more posts...</p>
      </div>
    </div>
  </template>
  
  <script>
  import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
  import Comments from "@/components/Comments.vue";
  import Like from "@/components/Like.vue"; // Import Like component
  
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
      Like, // Register Like component
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
      handleLikeUpdate(postId, { liked, likeCount }) {
        const post = this.posts.find((post) => post.id === postId);
        if (post) {
          post.liked = liked;
          post.like_count = likeCount;
        }
      },
    },
  };
  </script>
  