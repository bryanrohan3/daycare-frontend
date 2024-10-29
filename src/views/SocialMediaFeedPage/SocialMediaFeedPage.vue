<template>
  <div class="mt-20 align-center justify-center" @scroll.passive="handleScroll">
    <div v-if="posts.length > 0">
      <div class="fs-12 mb-30" v-for="post in posts" :key="post.id">
        <div class="flex-row-space">
          <p class="bold">{{ post.daycare.daycare_name }}</p>
          <p>
            {{ new Date(post.date_time_created).toLocaleString() }} ({{
              post.status || "No status"
            }})
          </p>
        </div>

        <p class="h-2 fs-12">{{ post.caption }}</p>

        <div v-if="post.pet_names.length > 0">
          <button
            class="button button--tertiary"
            @click="toggleTaggedUsers(post.id)"
          >
            <span v-if="post.showTaggedUsers">Hide</span>
            <span v-else>Tagged</span>
          </button>

          <p v-if="post.showTaggedUsers">
            {{ post.pet_names.map((pet) => pet.pet_name).join(", ") }}
          </p>
        </div>

        <Comments :postId="post.id" />

        <Like
          :postId="post.id"
          :initialLiked="post.liked"
          :initialLikeCount="post.like_count"
          @update-like="handleLikeUpdate"
        />
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
import Like from "@/components/Like.vue";

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
    Like,
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
        this.posts = [
          ...this.posts,
          ...response.data.results.map((post) => ({
            ...post,
            showTaggedUsers: false,
          })),
        ];
        this.next = response.data.next;
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        this.loading = false;
      }
    },
    toggleTaggedUsers(postId) {
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.showTaggedUsers = !post.showTaggedUsers;
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
    handleLikeUpdate({ postId, liked, likeId }) {
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.liked = liked;
        post.like_id = likeId;
      }
    },
  },
};
</script>
