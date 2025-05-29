<template>
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <div v-if="!user" class="text-center text-gray-500">No user selected.</div>

    <div v-else class="bg-white rounded-lg shadow-lg p-4 sm:p-6 relative">
      <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div class="relative">
          <img
            :src="user.picture"
            alt="user photo"
            class="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 object-cover flex-shrink-0 transition-colors"
            :class="isFavorite ? 'border-red-500' : 'border-indigo-500'"
          />
          <div class="absolute bottom-1 left-1" @click.stop="toggleFavorite">
            <button
              class="p-1.5 rounded-full bg-white shadow-md hover:shadow-lg transition-all border"
            >
              <svg
                class="w-5 h-5 transition-colors"
                :class="isFavorite ? 'text-red-500' : 'text-gray-400'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="text-center sm:text-left flex-grow">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {{ user.name }}
          </h2>
          <div class="space-y-1">
            <p class="text-gray-600">📍 {{ user.city }}, {{ user.country }}</p>
            <p class="text-gray-600">✉️ {{ user.email }}</p>
            <p class="text-gray-600 capitalize">👤 {{ user.gender }}</p>
            <p class="text-gray-600">🎂 {{ user.age }} years old</p>
          </div>
        </div>
      </div>

      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          @click="$router.push('/')"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Back to List
        </button>
        <button
          @click="toggleFavorite"
          class="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
          :class="
            isFavorite
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-indigo-500 hover:bg-indigo-600'
          "
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clip-rule="evenodd"
            />
          </svg>
          {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useUsers } from '@/composables/useUsers';
import { useRoute } from 'vue-router';

const store = useUserStore();
const route = useRoute();
const { users } = useUsers();

const user = computed(() => {
  const userId = route.params.id as string;

  const selectedUser = store.getSelectedUser(users.value);
  if (selectedUser && selectedUser.id === userId) {
    return selectedUser;
  }

  return users.value.find((u) => u.id === userId) || null;
});

const isFavorite = computed(() =>
  user.value ? store.isFavorite(user.value.id) : false
);

function toggleFavorite() {
  if (user.value) {
    store.toggleFavorite(user.value.id);
  }
}
</script>
