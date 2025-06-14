<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">Favorite Users</h2>
      <button
        v-if="favorites.length > 0"
        @click="clearAll"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Clear All Favorites ({{ store.favoriteCount }})
      </button>
    </div>

    <div v-if="favorites.length === 0" class="text-center py-12 text-gray-500">
      <div class="text-gray-400 text-6xl mb-4">💔</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        No favorite users yet
      </h3>
      <p class="text-gray-500 mb-4">Add some users to your favorites!</p>
      <button
        @click="router.push('/')"
        class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Browse Users
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UserCard
        v-for="user in favorites"
        :key="user.id"
        :user="user"
        :is-favorite="true"
        @select="goToDetails"
        @toggle-favorite="handleToggleFavorite"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useUsers } from '@/composables/useUsers';
import UserCard from '@/components/UserCard.vue';
import { useRouter } from 'vue-router';
import type { User } from '@/types/User';

const store = useUserStore();
const router = useRouter();
const { users } = useUsers();

const favorites = computed(() => store.getFavoriteUsers(users.value));

function goToDetails(user: User) {
  store.selectUser(user.id);
  router.push(`/user/${user.id}`);
}

function handleToggleFavorite(userId: string) {
  store.toggleFavorite(userId);
}

function clearAll() {
  store.clearFavorites();
}
</script>
