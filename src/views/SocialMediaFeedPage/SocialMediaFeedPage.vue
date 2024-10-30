<template>
  <div
    class="mt-20 align-center justify-center"
    @scroll.passive="handleScroll"
    style="
      overflow-y: auto;
      max-height: 100vh;
      scrollbar-color: #f5f5f5 #f5f5f5;
    "
    ref="scrollContainer"
  >
    <button
      @click="openCreatePostModal"
      class="create-post-button button button--small"
    >
      +
    </button>

    <div v-if="posts.length > 0">
      <div class="fs-12 mb-30" v-for="post in posts" :key="post.id">
        <div class="flex-row-space">
          <p class="bold">{{ post.daycare_name.daycare_name }}</p>
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
        <Comments :postId="post.id" :currentUserId="currentUserId" />
        <Like
          :postId="post.id"
          :initialLiked="post.liked"
          :initialLikeCount="post.like_count"
          @update-like="handleLikeUpdate"
        />
      </div>

      <div v-if="loading" class="text-center mt-30">
        <p>Loading more posts...</p>
      </div>

      <p v-if="!loading && !next" class="mt-30 text-center fs-12">
        End of Page
      </p>
    </div>

    <p class="mt-30 text-center align-center fs-12" v-else>
      No posts to display
    </p>

    <Modal
      :isVisible="isCreatePostModalVisible"
      @update:isVisible="isCreatePostModalVisible = $event"
    >
      <CreatePost @close="isCreatePostModalVisible = false" />
    </Modal>
  </div>
</template>

<script>
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";
import { fetchCurrentStaffProfile } from "@/helpers/fetchCurrentStaffProfile";
import Comments from "@/components/Comments.vue";
import Like from "@/components/Like.vue";
import CreatePost from "@/components/CreatePost.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "SocialMediaFeedPage",
  data() {
    return {
      posts: [],
      next: null,
      loading: false,
      isCreatePostModalVisible: false,
      currentUserId: null,
      userDaycares: [],
    };
  },
  components: {
    Comments,
    Like,
    CreatePost,
    Modal,
  },
  async mounted() {
    this.currentUserId = await this.getCurrentUserId();
    this.userDaycares = await this.fetchUserDaycares();
    this.fetchPosts(); // Moved this to be after user fetch
    this.$refs.scrollContainer.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    this.$refs.scrollContainer.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async fetchUserDaycares() {
      try {
        const response = await axiosInstance.get(endpoints.userDaycares);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch user daycares:", error);
        return [];
      }
    },
    openCreatePostModal() {
      this.isCreatePostModalVisible = true;
    },
    async getCurrentUserId() {
      try {
        const profile = await fetchCurrentStaffProfile();
        return profile.id;
      } catch (error) {
        console.error("Failed to fetch current user profile:", error);
        return null;
      }
    },
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
            liked: post.liked,
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
      const container = this.$refs.scrollContainer;
      const scrollTop = container.scrollTop + container.clientHeight;
      const documentHeight = container.scrollHeight;

      if (
        scrollTop >= documentHeight - 100 &&
        this.posts.length > 0 &&
        this.next &&
        !this.loading
      ) {
        this.fetchPosts(this.next);
      }
    },
    handleLikeUpdate({ postId, liked, likeCount, likeId }) {
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.liked = liked;
        post.like_count = likeCount;
        post.likeId = liked ? likeId : null;
      }
    },
  },
};
</script>

<style scoped>
.create-post-button {
  position: absolute;
  top: 15px;
  right: 5px;
  font-size: 20px;
  cursor: pointer;
  border: none;
  width: 30px;
  height: 30px;
}
</style>
