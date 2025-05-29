<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">User List</h2>
      <div class="text-sm text-gray-500">
        {{ totalUsers }} users loaded
      </div>
    </div>

    <!-- Filters -->
    <Filters
      v-model:selectedCountry="selectedCountry"
      v-model:selectedGender="selectedGender"
      :countries="uniqueCountries"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      <span class="ml-2 text-gray-500">Loading users...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-400 text-6xl mb-4">⚠️</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to load users</h3>
      <p class="text-gray-500 mb-4">{{ error }}</p>
      <button 
        @click="retryFetch"
        class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Empty State (No filtered results) -->
    <div v-else-if="filteredUsers.length === 0 && store.allUsers.length > 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">🔍</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
      <p class="text-gray-500 mb-4">No users match your current filters.</p>
      <button 
        @click="clearFilters"
        class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Clear Filters
      </button>
    </div>

    <!-- Empty State (No users at all) -->
    <div v-else-if="!isLoading && store.allUsers.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">👤</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No users available</h3>
      <p class="text-gray-500 mb-4">Unable to load users. Please try again.</p>
      <button 
        @click="retryFetch"
        class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Retry
      </button>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UserCard
          v-for="user in filteredUsers"
          :key="user.id"
          :user="user"
          @select="goToDetails"
        />
      </div>

      <div v-if="hasMorePages && filteredUsers.length > 0" class="flex justify-center mt-8">
        <button
          @click="loadMore"
          :disabled="isLoadingMore"
          class="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <div 
            v-if="isLoadingMore" 
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
          ></div>
          {{ isLoadingMore ? 'Loading...' : 'Load More Users' }}
        </button>
      </div>

      <div v-else-if="!hasMorePages && filteredUsers.length > 0" class="text-center mt-8 text-gray-500">
        <p>You've reached the end of the user list! 🎉</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUsers } from '@/composables/useUsers';
import { useUserStore } from '@/stores/userStore';
import UserCard from '@/components/UserCard.vue';
import Filters from '@/components/Filters.vue';
import { useRouter } from 'vue-router';
import type { User } from '@/types/User';

// Store, Router, and Data
const store = useUserStore();
const router = useRouter();
const { 
  users, 
  fetchUsers, 
  loadMoreUsers, 
  refreshUsers,
  isLoading, 
  isLoadingMore,
  error,
  hasMorePages,
  totalUsers 
} = useUsers();

const selectedCountry = ref('');
const selectedGender = ref('');

onMounted(async () => {
  await fetchUsers();
  store.setUsers(users.value);
});

const filteredUsers = computed(() => {
  const allUsers = users.value;
  
  return allUsers.filter((user) => {
    const matchCountry = selectedCountry.value
      ? user.country === selectedCountry.value
      : true;
    const matchGender = selectedGender.value
      ? user.gender === selectedGender.value
      : true;
    return matchCountry && matchGender;
  });
});

const uniqueCountries = computed(() => {
  const countries = users.value.map((u) => u.country);
  return [...new Set(countries)].sort();
});

function goToDetails(user: User) {
  store.selectUser(user);
  router.push(`/user/${user.id}`);
}

function clearFilters() {
  selectedCountry.value = '';
  selectedGender.value = '';
}

async function retryFetch() {
  await refreshUsers();
  store.setUsers(users.value);
}

async function loadMore() {
  await loadMoreUsers();
  store.setUsers(users.value);
}
</script>